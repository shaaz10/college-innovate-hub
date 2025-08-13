import express from 'express';
import { Problem } from '../models/Problem';
import { Comment } from '../models/Comment';
import { authenticate, optionalAuth, AuthRequest } from '../middleware/auth';
import { validateProblem, validateObjectId, validatePagination } from '../middleware/validation';

const router = express.Router();

// @route   GET /api/problems
// @desc    Get all problems with filtering and pagination
// @access  Public
router.get('/', validatePagination, optionalAuth, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort as string || 'newest';
    const search = req.query.search as string;
    const tags = req.query.tags as string;
    const author = req.query.author as string;
    
    // Build query
    const query: any = { status: 'published' };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
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
      case 'trending':
        // Simple trending algorithm based on recent activity
        sortQuery = { 
          $expr: {
            $add: [
              { $size: '$upvotes' },
              { $divide: ['$views', 10] },
              { $divide: [{ $subtract: [new Date(), '$createdAt'] }, 86400000] } // Days since creation
            ]
          }
        };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }
    
    const problems = await Problem.find(query)
      .populate('author', 'firstName lastName avatar university')
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Problem.countDocuments(query);
    
    // Add user-specific data if authenticated
    const problemsWithUserData = problems.map(problem => ({
      ...problem,
      upvoteCount: problem.upvotes.length,
      downvoteCount: problem.downvotes.length,
      netVotes: problem.upvotes.length - problem.downvotes.length,
      isUpvoted: req.user ? problem.upvotes.includes(req.user._id) : false,
      isDownvoted: req.user ? problem.downvotes.includes(req.user._id) : false,
      upvotes: undefined, // Remove actual vote arrays for privacy
      downvotes: undefined
    }));
    
    res.json({
      success: true,
      data: {
        problems: problemsWithUserData,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/problems/:id
// @desc    Get single problem by ID
// @access  Public
router.get('/:id', validateObjectId(), optionalAuth, async (req: AuthRequest, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate('author', 'firstName lastName avatar university bio')
      .lean();
    
    if (!problem || problem.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    
    // Increment view count
    await Problem.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    
    // Get comments count
    const commentsCount = await Comment.countDocuments({
      targetType: 'Problem',
      targetId: req.params.id,
      status: 'active'
    });
    
    const problemWithUserData = {
      ...problem,
      upvoteCount: problem.upvotes.length,
      downvoteCount: problem.downvotes.length,
      netVotes: problem.upvotes.length - problem.downvotes.length,
      commentsCount,
      isUpvoted: req.user ? problem.upvotes.includes(req.user._id) : false,
      isDownvoted: req.user ? problem.downvotes.includes(req.user._id) : false,
      upvotes: undefined,
      downvotes: undefined
    };
    
    res.json({
      success: true,
      data: { problem: problemWithUserData }
    });
  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/problems
// @desc    Create a new problem
// @access  Private
router.post('/', authenticate, validateProblem, async (req: AuthRequest, res) => {
  try {
    const problemData = {
      ...req.body,
      author: req.user!._id,
      tags: req.body.tags?.map((tag: string) => tag.toLowerCase()) || []
    };
    
    const problem = new Problem(problemData);
    await problem.save();
    
    await problem.populate('author', 'firstName lastName avatar university');
    
    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      data: { problem }
    });
  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/problems/:id
// @desc    Update a problem
// @access  Private (Author only)
router.put('/:id', authenticate, validateObjectId(), validateProblem, async (req: AuthRequest, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    
    // Check ownership
    if (problem.author.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this problem'
      });
    }
    
    const updateData = {
      ...req.body,
      tags: req.body.tags?.map((tag: string) => tag.toLowerCase()) || problem.tags
    };
    
    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'firstName lastName avatar university');
    
    res.json({
      success: true,
      message: 'Problem updated successfully',
      data: { problem: updatedProblem }
    });
  } catch (error) {
    console.error('Update problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/problems/:id
// @desc    Delete a problem
// @access  Private (Author only)
router.delete('/:id', authenticate, validateObjectId(), async (req: AuthRequest, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    
    // Check ownership
    if (problem.author.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this problem'
      });
    }
    
    await Problem.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Problem deleted successfully'
    });
  } catch (error) {
    console.error('Delete problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/problems/:id/vote
// @desc    Vote on a problem (upvote/downvote)
// @access  Private
router.post('/:id/vote', authenticate, validateObjectId(), async (req: AuthRequest, res) => {
  try {
    const { type } = req.body; // 'upvote' or 'downvote'
    const userId = req.user!._id;
    
    if (!['upvote', 'downvote'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Vote type must be upvote or downvote'
      });
    }
    
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    
    // Remove existing votes by this user
    problem.upvotes = problem.upvotes.filter(id => !id.equals(userId));
    problem.downvotes = problem.downvotes.filter(id => !id.equals(userId));
    
    // Add new vote
    if (type === 'upvote') {
      problem.upvotes.push(userId);
    } else {
      problem.downvotes.push(userId);
    }
    
    await problem.save();
    
    res.json({
      success: true,
      message: `Problem ${type}d successfully`,
      data: {
        upvoteCount: problem.upvotes.length,
        downvoteCount: problem.downvotes.length,
        netVotes: problem.upvotes.length - problem.downvotes.length
      }
    });
  } catch (error) {
    console.error('Vote problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/problems/:id/vote
// @desc    Remove vote from a problem
// @access  Private
router.delete('/:id/vote', authenticate, validateObjectId(), async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    
    // Remove votes by this user
    problem.upvotes = problem.upvotes.filter(id => !id.equals(userId));
    problem.downvotes = problem.downvotes.filter(id => !id.equals(userId));
    
    await problem.save();
    
    res.json({
      success: true,
      message: 'Vote removed successfully',
      data: {
        upvoteCount: problem.upvotes.length,
        downvoteCount: problem.downvotes.length,
        netVotes: problem.upvotes.length - problem.downvotes.length
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