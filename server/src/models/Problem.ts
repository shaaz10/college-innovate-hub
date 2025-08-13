import mongoose, { Document, Schema } from 'mongoose';

export interface IProblem extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  excerpt: string;
  description: string;
  image?: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  background?: string;
  scalability?: string;
  marketSize?: string;
  competitors: string[];
  currentGaps?: string;
  upvotes: mongoose.Types.ObjectId[];
  downvotes: mongoose.Types.ObjectId[];
  views: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const problemSchema = new Schema<IProblem>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  image: {
    type: String,
    default: ''
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  background: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  scalability: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  marketSize: {
    type: String,
    trim: true,
    maxlength: 500
  },
  competitors: [{
    type: String,
    trim: true
  }],
  currentGaps: {
    type: String,
    trim: true,
    maxlength: 2000
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
problemSchema.index({ title: 'text', description: 'text', tags: 'text' });
problemSchema.index({ author: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ status: 1 });
problemSchema.index({ featured: 1 });
problemSchema.index({ createdAt: -1 });

// Virtual for upvote count
problemSchema.virtual('upvoteCount').get(function() {
  return this.upvotes.length;
});

// Virtual for downvote count
problemSchema.virtual('downvoteCount').get(function() {
  return this.downvotes.length;
});

// Virtual for net votes
problemSchema.virtual('netVotes').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

export const Problem = mongoose.model<IProblem>('Problem', problemSchema);