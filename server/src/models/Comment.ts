import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  author: mongoose.Types.ObjectId;
  targetType: 'Problem' | 'Idea' | 'Startup';
  targetId: mongoose.Types.ObjectId;
  parentComment?: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  isEdited: boolean;
  editedAt?: Date;
  status: 'active' | 'deleted' | 'hidden';
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetType: {
    type: String,
    required: true,
    enum: ['Problem', 'Idea', 'Startup']
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType'
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'deleted', 'hidden'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
commentSchema.index({ targetType: 1, targetId: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ createdAt: -1 });

// Virtual for like count
commentSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for replies (populated separately)
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment'
});

export const Comment = mongoose.model<IComment>('Comment', commentSchema);