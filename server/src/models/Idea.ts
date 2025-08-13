import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamMember {
  name: string;
  email: string;
  role: string;
  avatar?: string;
  userId?: mongoose.Types.ObjectId;
}

export interface IIdea extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  problemId: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  team: ITeamMember[];
  stage: number; // 1-9
  mentor?: string;
  attachments: string[];
  contact: string;
  upvotes: mongoose.Types.ObjectId[];
  downvotes: mongoose.Types.ObjectId[];
  views: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  tags: string[];
  businessModel?: string;
  targetMarket?: string;
  competitiveAdvantage?: string;
  fundingNeeds?: string;
  timeline?: {
    milestone: string;
    targetDate: Date;
    completed: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
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
}, { _id: false });

const ideaSchema = new Schema<IIdea>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: [teamMemberSchema],
  stage: {
    type: Number,
    required: true,
    min: 1,
    max: 9,
    default: 1
  },
  mentor: {
    type: String,
    trim: true
  },
  attachments: [{
    type: String,
    trim: true
  }],
  contact: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  upvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  businessModel: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  targetMarket: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  competitiveAdvantage: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  fundingNeeds: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  timeline: [{
    milestone: {
      type: String,
      required: true,
      trim: true
    },
    targetDate: {
      type: Date,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
ideaSchema.index({ title: 'text', description: 'text', tags: 'text' });
ideaSchema.index({ problemId: 1 });
ideaSchema.index({ author: 1 });
ideaSchema.index({ stage: 1 });
ideaSchema.index({ status: 1 });
ideaSchema.index({ featured: 1 });
ideaSchema.index({ createdAt: -1 });

// Virtual for upvote count
ideaSchema.virtual('upvoteCount').get(function() {
  return this.upvotes.length;
});

// Virtual for downvote count
ideaSchema.virtual('downvoteCount').get(function() {
  return this.downvotes.length;
});

// Virtual for net votes
ideaSchema.virtual('netVotes').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

// Virtual for stage label
ideaSchema.virtual('stageLabel').get(function() {
  const stageLabels = [
    'Ideation', 'Research', 'Validation', 'Prototype', 'Testing',
    'Launch Prep', 'MVP Launch', 'Growth', 'Scale/Exit'
  ];
  return stageLabels[this.stage - 1] || 'Unknown';
});

export const Idea = mongoose.model<IIdea>('Idea', ideaSchema);