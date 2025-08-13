import express from 'express';
import { Comment } from '../models/Comment';
import { Problem } from '../models/Problem';
import { Idea } from '../models/Idea';
import { Startup } from '../models/Startup';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validateComment, validateObjectId, validatePagination } from '../middleware/validation';

const router = express.Router();

// @route   GET /api/comments
// @desc    Get comments for a specific target (Problem/Idea/Startup)
// @access  Public
router.get('/', validatePagination, async (req, res) => {
  try {
    const { targetType, targetId, parentComment } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    if (!targetType || !targetId) {
      return res.status(400).json({
        success: false,
        message: 'targetType and targetId are required'
      });
    }
    
    // Build query
    const query: any = {
      targetType,
      targetId,
      status: 'active'
    };
    
    // If parentComment is provided, get replies; otherwise get top-level comments
    if (parentComment) {
      query.parentComment = parentComment;
    } else {
      query.parentComment = { $exists: false };
    }
    
    const comments = await Comment.find(query)
      .populate('author', 'firstName lastName avatar university')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Comment.countDocuments(query);
    
    // Get reply counts for top-level comments
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replyCount = await Comment.countDocuments({
          parentComment: comment._id,
          status: 'active'
        });
        
        return {
          ...comment,
          likeCount: comment.likes.length,
          replyCount,
          likes: undefined // Remove actual likes array for privacy
        };
      })
    );
    
    res.json({
      success: true,
      data: {
        comments: commentsWithReplies,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/comments
// @desc    Create a new comment
// @access  Private
router.post('/', authenticate, validateComment, async (req: AuthRequest, res) => {
  try {
    const { content, targetType, targetId, parentComment } = req.body;
    
    // Verify target exists
    let targetExists = false;
    switch (targetType) {
      case 'Problem':
        targetExists = await Problem.exists({ _id: targetId });
        break;
      case 'Idea':
        targetExists = await Idea.exists({ _id: targetId });
        break;
      case 'Startup':
        targetExists = await Startup.exists({ _id: targetId });
        break;
    }
    
    if (!targetExists) {
      return res.status(404).json({
        success: false,
        message: `${targetType} not found`
      });
    }
    
    // Verify parent comment exists if provided
    if (parentComment) {
      const parentExists = await Comment.findById(parentComment);
      if (!parentExists) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }
      
      // Ensure parent comment is for the same target
      if (parentExists.targetType !== targetType || parentExists.targetId.toString() !== targetId) {
        return res.status(400).json({
          success: false,
          message: 'Parent comment must be for the same target'
        });
      }
    }
    
    const comment = new Comment({
      content,
      author: req.user!._id,
      targetType,
      targetId,
      parentComment: parentComment || undefined
    });
    
    await comment.save();
    await comment.populate('author', 'firstName lastName avatar university');
    
    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: { comment }
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/comments/:id
// @desc    Update a comment
// @access  Private (Author only)
router.put('/:id', authenticate, validateObjectId(), async (req: AuthRequest, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }
    
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check ownership
    if (comment.author.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }
    
    comment.content = content.trim();
    comment.isEdited = true;
    comment.editedAt = new Date();
    
    await comment.save();
    await comment.populate('author', 'firstName lastName avatar university');
    
    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: { comment }
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private (Author only)
router.delete('/:id', authenticate, validateObjectId(), async (req: AuthRequest, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check ownership
    if (comment.author.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }
    
    // Soft delete - mark as deleted instead of removing
    comment.status = 'deleted';
    comment.content = '[Comment deleted]';
    await comment.save();
    
    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/comments/:id/like
// @desc    Like/unlike a comment
// @access  Private
router.post('/:id/like', authenticate, validateObjectId(), async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if already liked
    const alreadyLiked = comment.likes.some(id => id.equals(userId));
    
    if (alreadyLiked) {
      // Remove like
      comment.likes = comment.likes.filter(id => !id.equals(userId));
    } else {
      // Add like
      comment.likes.push(userId);
    }
    
    await comment.save();
    
    res.json({
      success: true,
      message: alreadyLiked ? 'Like removed successfully' : 'Comment liked successfully',
      data: {
        likeCount: comment.likes.length,
        isLiked: !alreadyLiked
      }
    });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;