import express from 'express';
import { Startup } from '../models/Startup';
import { Idea } from '../models/Idea';
import { Comment } from '../models/Comment';
import { authenticate, optionalAuth, AuthRequest } from '../middleware/auth';
import { validateStartup, validateObjectId, validatePagination } from '../middleware/validation';

const router = express.Router();

// @route   GET /api/startups
// @desc    Get all startups with filtering and pagination
// @access  Public
router.get('/', validatePagination, optionalAuth, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort as string || 'newest';
    const search = req.query.search as string;
    const industry = req.query.industry as string;
    const stage = req.query.stage as string;
    const status = req.query.status as string;
    const founder = req.query.founder as string;
    
    // Build query
    const query: any = { status: status || 'active' };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (industry) {
      const industryArray = industry.split(',').map(ind => ind.trim().toLowerCase());
      query.industry = { $in: industryArray };
    }
    
    if (stage) {
      query.stage = parseInt(stage);
    }
    
    if (founder) {
      query.founder = founder;
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
      case 'funding':
        sortQuery = { fundingAmount: -1, createdAt: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }
    
    const startups = await Startup.find(query)
      .populate('founder', 'firstName lastName avatar university')
      .populate('ideaId', 'title')
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Startup.countDocuments(query);
    
    // Add user-specific data if authenticated
    const startupsWithUserData = startups.map(startup => ({
      ...startup,
      upvoteCount: startup.upvotes.length,
      isUpvoted: req.user ? startup.upvotes.includes(req.user._id) : false,
      completedMilestones: startup.milestones.filter(m => m.completed).length,
      upvotes: undefined // Remove actual vote arrays for privacy
    }));
    
    res.json({
      success: true,
      data: {
        startups: startupsWithUserData,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get startups error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/startups/:id
// @desc    Get single startup by ID
// @access  Public
router.get('/:id', validateObjectId(), optionalAuth, async (req: AuthRequest, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
      .populate('founder', 'firstName lastName avatar university bio')
      .populate('ideaId', 'title description')
      .lean();
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found'
      });
    }
    
    // Increment view count
    await Startup.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    
    // Get comments count
    const commentsCount = await Comment.countDocuments({
      targetType: 'Startup',
      targetId: req.params.id,
      status: 'active'
    });
    
    const startupWithUserData = {
      ...startup,
      upvoteCount: startup.upvotes.length,
      commentsCount,
      completedMilestones: startup.milestones.filter(m => m.completed).length,
      isUpvoted: req.user ? startup.upvotes.includes(req.user._id) : false,
      upvotes: undefined
    };
    
    res.json({
      success: true,
      data: { startup: startupWithUserData }
    });
  } catch (error) {
    console.error('Get startup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/startups
// @desc    Create a new startup
// @access  Private
router.post('/', authenticate, validateStartup, async (req: AuthRequest, res) => {
  try {
    // Verify idea exists if ideaId is provided
    if (req.body.ideaId) {
      const idea = await Idea.findById(req.body.ideaId);
      if (!idea) {
        return res.status(404).json({
          success: false,
          message: 'Idea not found'
        });
      }
    }
    
    const startupData = {
      ...req.body,
      founder: req.user!._id,
      industry: req.body.industry?.map((ind: string) => ind.toLowerCase()) || [],
      tags: req.body.tags?.map((tag: string) => tag.toLowerCase()) || []
    };
    
    const startup = new Startup(startupData);
    await startup.save();
    
    await startup.populate([
      { path: 'founder', select: 'firstName lastName avatar university' },
      { path: 'ideaId', select: 'title' }
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Startup created successfully',
      data: { startup }
    });
  } catch (error) {
    console.error('Create startup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/startups/:id
// @desc    Update a startup
// @access  Private (Founder only)
router.put('/:id', authenticate, validateObjectId(), validateStartup, async (req: AuthRequest, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found'
      });
    }
    
    // Check ownership
    if (startup.founder.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this startup'
      });
    }
    
    // Verify idea exists if ideaId is being updated
    if (req.body.ideaId && req.body.ideaId !== startup.ideaId?.toString()) {
      const idea = await Idea.findById(req.body.ideaId);
      if (!idea) {
        return res.status(404).json({
          success: false,
          message: 'Idea not found'
        });
      }
    }
    
    const updateData = {
      ...req.body,
      industry: req.body.industry?.map((ind: string) => ind.toLowerCase()) || startup.industry,
      tags: req.body.tags?.map((tag: string) => tag.toLowerCase()) || startup.tags
    };
    
    const updatedStartup = await Startup.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'founder', select: 'firstName lastName avatar university' },
      { path: 'ideaId', select: 'title' }
    ]);
    
    res.json({
      success: true,
      message: 'Startup updated successfully',
      data: { startup: updatedStartup }
    });
  } catch (error) {
    console.error('Update startup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/startups/:id
// @desc    Delete a startup
// @access  Private (Founder only)
router.delete('/:id', authenticate, validateObjectId(), async (req: AuthRequest, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found'
      });
    }
    
    // Check ownership
    if (startup.founder.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this startup'
      });
    }
    
    await Startup.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Startup deleted successfully'
    });
  } catch (error) {
    console.error('Delete startup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/startups/:id/vote
// @desc    Upvote a startup
// @access  Private
router.post('/:id/vote', authenticate, validateObjectId(), async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    
    const startup = await Startup.findById(req.params.id);
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found'
      });
    }
    
    // Check if already upvoted
    const alreadyUpvoted = startup.upvotes.some(id => id.equals(userId));
    
    if (alreadyUpvoted) {
      // Remove upvote
      startup.upvotes = startup.upvotes.filter(id => !id.equals(userId));
    } else {
      // Add upvote
      startup.upvotes.push(userId);
    }
    
    await startup.save();
    
    res.json({
      success: true,
      message: alreadyUpvoted ? 'Upvote removed successfully' : 'Startup upvoted successfully',
      data: {
        upvoteCount: startup.upvotes.length,
        isUpvoted: !alreadyUpvoted
      }
    });
  } catch (error) {
    console.error('Vote startup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/startups/:id/milestones/:milestoneIndex
// @desc    Update milestone completion status
// @access  Private (Founder only)
router.put('/:id/milestones/:milestoneIndex', authenticate, validateObjectId(), async (req: AuthRequest, res) => {
  try {
    const { completed } = req.body;
    const milestoneIndex = parseInt(req.params.milestoneIndex);
    
    const startup = await Startup.findById(req.params.id);
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found'
      });
    }
    
    // Check ownership
    if (startup.founder.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this startup'
      });
    }
    
    if (milestoneIndex < 0 || milestoneIndex >= startup.milestones.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid milestone index'
      });
    }
    
    startup.milestones[milestoneIndex].completed = completed;
    await startup.save();
    
    res.json({
      success: true,
      message: 'Milestone updated successfully',
      data: { 
        milestone: startup.milestones[milestoneIndex],
        completedMilestones: startup.milestones.filter(m => m.completed).length
      }
    });
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;