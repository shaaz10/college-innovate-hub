import express from 'express';
import { Idea } from '../models/Ideas';
import { Problem } from '../models/Problem';
import { Comment } from '../models/Comment';
import { authenticate, optionalAuth, AuthRequest } from '../middleware/auth';
import { validateIdea, validateObjectId, validatePagination } from '../middleware/validation';

const router = express.Router();

// @route   GET /api/ideas
// @desc    Get all ideas with filtering and pagination
// @access  Public
router.get('/', validatePagination, optionalAuth, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort as string || 'newest';
    const search = req.query.search as string;
    const problemId = req.query.problemId as string;
    const stage = req.query.stage as string;
    const author = req.query.author as string;
    
    // Build query
    const query: any = { status: 'published' };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (problemId) {
      query.problemId = problemId;
    }
    
    if (stage) {
      query.stage = parseInt(stage);
    }
    
    if (author) {
      query.author = author;
    }
    
    // Build sort
    let sortQuery: any = {};
    switch (sort) {
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      case 'oldest':
        sortQuery = { createdAt: 1 };
        break;
      case 'popular':
        sortQuery = { upvotes: -1, views: -1 };
        break;
      case 'stage':
        sortQuery = { stage: -1, createdAt: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }
    
    const ideas = await Idea.find(query)
      .populate('author', 'firstName lastName avatar university')
      .populate('problemId', 'title')
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Idea.countDocuments(query);
    
    // Add user-specific data if authenticated
    const ideasWithUserData = ideas.map(idea => ({
      ...idea,
      upvoteCount: idea.upvotes.length,
      downvoteCount: idea.downvotes.length,
      netVotes: idea.upvotes.length - idea.downvotes.length,
      isUpvoted: req.user ? idea.upvotes.includes(req.user._id) : false,
      isDownvoted: req.user ? idea.downvotes.includes(req.user._id) : false,
      upvotes: undefined,
      downvotes: undefined
    }));
    
    res.json({
      success: true,
      data: {
        ideas: ideasWithUserData,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get ideas error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/ideas/:id
// @desc    Get single idea by ID
// @access  Public
router.get('/:id', validateObjectId(), optionalAuth, async (req: AuthRequest, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('author', 'firstName lastName avatar university bio')
      .populate('problemId', 'title excerpt')
      .lean();
    
    if (!idea || idea.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }
    
    // Increment view count
    await Idea.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    
    // Get comments count
    const commentsCount = await Comment.countDocuments({
      targetType: 'Idea',
      targetId: req.params.id,
      status: 'active'
    });
    
    const ideaWithUserData = {
      ...idea,
      upvoteCount: idea.upvotes.length,
      downvoteCount: idea.downvotes.length,
      netVotes: idea.upvotes.length - idea.downvotes.length,
      commentsCount,
      isUpvoted: req.user ? idea.upvotes.includes(req.user._id) : false,
      isDownvoted: req.user ? idea.downvotes.includes(req.user._id) : false,
      upvotes: undefined,
      downvotes: undefined
    };
    
    res.json({
      success: true,
      data: { idea: ideaWithUserData }
    });
  } catch (error) {
    console.error('Get idea error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/ideas
// @desc    Create a new idea
// @access  Private
router.post('/', authenticate, validateIdea, async (req: AuthRequest, res) => {
  try {
    // Verify problem exists
    const problem = await Problem.findById(req.body.problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    
    const ideaData = {
      ...req.body,
      author: req.user!._id,
      tags: req.body.tags?.map((tag: string) => tag.toLowerCase()) || []
    };
    
    const idea = new Idea(ideaData);
    await idea.save();
    
    await idea.populate([
      { path: 'author', select: 'firstName lastName avatar university' },
      { path: 'problemId', select: 'title' }
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Idea created successfully',
      data: { idea }
    });
  } catch (error) {
    console.error('Create idea error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/ideas/:id
// @desc    Update an idea
// @access  Private (Author only)
router.put('/:id', authenticate, validateObjectId(), validateIdea, async (req: AuthRequest, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }
    
    // Check ownership
    if (idea.author.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this idea'
      });
    }
    
    // Verify problem exists if problemId is being updated
    if (req.body.problemId && req.body.problemId !== idea.problemId.toString()) {
      const problem = await Problem.findById(req.body.problemId);
      if (!problem) {
        return res.status(404).json({
          success: false,
          message: 'Problem not found'
        });
      }
    }
    
    const updateData = {
      ...req.body,
      tags: req.body.tags?.map((tag: string) => tag.toLowerCase()) || idea.tags
    };
    
    const updatedIdea = await Idea.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'author', select: 'firstName lastName avatar university' },
      { path: 'problemId', select: 'title' }
    ]);
    
    res.json({
      success: true,
      message: 'Idea updated successfully',
      data: { idea: updatedIdea }
    });
  } catch (error) {
    console.error('Update idea error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/ideas/:id
// @desc    Delete an idea
// @access  Private (Author only)
router.delete('/:id', authenticate, validateObjectId(), async (req: AuthRequest, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }
    
    // Check ownership
    if (idea.author.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this idea'
      });
    }
    
    await Idea.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Idea deleted successfully'
    });
  } catch (error) {
    console.error('Delete idea error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/ideas/:id/vote
// @desc    Vote on an idea (upvote/downvote)
// @access  Private
router.post('/:id/vote', authenticate, validateObjectId(), async (req: AuthRequest, res) => {
  try {
    const { type } = req.body;
    const userId = req.user!._id;
    
    if (!['upvote', 'downvote'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Vote type must be upvote or downvote'
      });
    }
    
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }
    
    // Remove existing votes by this user
    idea.upvotes = idea.upvotes.filter(id => !id.equals(userId));
    idea.downvotes = idea.downvotes.filter(id => !id.equals(userId));
    
    // Add new vote
    if (type === 'upvote') {
      idea.upvotes.push(userId);
    } else {
      idea.downvotes.push(userId);
    }
    
    await idea.save();
    
    res.json({
      success: true,
      message: `Idea ${type}d successfully`,
      data: {
        upvoteCount: idea.upvotes.length,
        downvoteCount: idea.downvotes.length,
        netVotes: idea.upvotes.length - idea.downvotes.length
      }
    });
  } catch (error) {
    console.error('Vote idea error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/ideas/:id/vote
// @desc    Remove vote from an idea
// @access  Private
router.delete('/:id/vote', authenticate, validateObjectId(), async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }
    
    // Remove votes by this user
    idea.upvotes = idea.upvotes.filter(id => !id.equals(userId));
    idea.downvotes = idea.downvotes.filter(id => !id.equals(userId));
    
    await idea.save();
    
    res.json({
      success: true,
      message: 'Vote removed successfully',
      data: {
        upvoteCount: idea.upvotes.length,
        downvoteCount: idea.downvotes.length,
        netVotes: idea.upvotes.length - idea.downvotes.length
      }
    });
  } catch (error) {
    console.error('Remove vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;