import mongoose, { Document, Schema } from 'mongoose';

export interface IMilestone {
  title: string;
  date: Date;
  completed: boolean;
  description?: string;
}

export interface IStartup extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  ideaId?: mongoose.Types.ObjectId;
  founder: mongoose.Types.ObjectId;
  team: {
    name: string;
    role: string;
    avatar?: string;
    userId?: mongoose.Types.ObjectId;
  }[];
  stage: number; // 1-9
  fundingStatus: string;
  fundingAmount?: number;
  schemes: string[];
  upvotes: mongoose.Types.ObjectId[];
  milestones: IMilestone[];
  onePager?: string;
  pitchDeck?: string;
  website?: string;
  logo?: string;
  industry: string[];
  location?: string;
  foundedDate: Date;
  employees?: number;
  revenue?: number;
  businessModel: string;
  targetMarket: string;
  competitiveAdvantage: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  status: 'active' | 'acquired' | 'closed' | 'paused';
  featured: boolean;
  views: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const milestoneSchema = new Schema<IMilestone>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, { _id: false });

const startupSchema = new Schema<IStartup>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  ideaId: {
    type: Schema.Types.ObjectId,
    ref: 'Idea'
  },
  founder: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    avatar: {
      type: String,
      default: ''
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  stage: {
    type: Number,
    required: true,
    min: 1,
    max: 9,
    default: 1
  },
  fundingStatus: {
    type: String,
    required: true,
    trim: true
  },
  fundingAmount: {
    type: Number,
    min: 0
  },
  schemes: [{
    type: String,
    trim: true
  }],
  upvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  milestones: [milestoneSchema],
  onePager: {
    type: String,
    trim: true
  },
  pitchDeck: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  logo: {
    type: String,
    trim: true
  },
  industry: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  location: {
    type: String,
    trim: true
  },
  foundedDate: {
    type: Date,
    default: Date.now
  },
  employees: {
    type: Number,
    min: 0
  },
  revenue: {
    type: Number,
    min: 0
  },
  businessModel: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  targetMarket: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  competitiveAdvantage: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  socialLinks: {
    website: String,
    linkedin: String,
    twitter: String,
    facebook: String
  },
  status: {
    type: String,
    enum: ['active', 'acquired', 'closed', 'paused'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
startupSchema.index({ name: 'text', description: 'text', tags: 'text' });
startupSchema.index({ founder: 1 });
startupSchema.index({ ideaId: 1 });
startupSchema.index({ stage: 1 });
startupSchema.index({ status: 1 });
startupSchema.index({ industry: 1 });
startupSchema.index({ featured: 1 });
startupSchema.index({ createdAt: -1 });

// Virtual for upvote count
startupSchema.virtual('upvoteCount').get(function() {
  return this.upvotes.length;
});

// Virtual for completed milestones count
startupSchema.virtual('completedMilestones').get(function() {
  return this.milestones.filter(m => m.completed).length;
});

// Virtual for stage label
startupSchema.virtual('stageLabel').get(function() {
  const stageLabels = [
    'Ideation', 'Research', 'Validation', 'Prototype', 'Testing',
    'Launch Prep', 'MVP Launch', 'Growth', 'Scale/Exit'
  ];
  return stageLabels[this.stage - 1] || 'Unknown';
});

export const Startup = mongoose.model<IStartup>('Startup', startupSchema);