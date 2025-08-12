import { useState } from "react";
import { Send, Heart, Reply, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onLikeComment: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
}

const CommentSection = ({ comments, onAddComment, onLikeComment, onReply }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  const handleSubmitReply = (commentId: string) => {
    if (replyContent.trim()) {
      onReply(commentId, replyContent);
      setReplyContent("");
      setReplyTo(null);
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-12' : ''} mb-6`}>
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.avatar} />
          <AvatarFallback>{comment.author[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-vj-primary">{comment.author}</span>
            <span className="text-xs text-vj-muted">{comment.timestamp}</span>
          </div>
          
          <p className="text-sm text-vj-primary leading-relaxed mb-3">
            {comment.content}
          </p>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLikeComment(comment.id)}
              className={`h-8 px-2 text-xs ${comment.isLiked ? 'text-red-500' : 'text-vj-muted'}`}
            >
              <Heart size={14} className={comment.isLiked ? 'fill-current' : ''} />
              <span className="ml-1">{comment.likes}</span>
            </Button>
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyTo(comment.id)}
                className="h-8 px-2 text-xs text-vj-muted"
              >
                <Reply size={14} />
                <span className="ml-1">Reply</span>
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-vj-muted">
                  <MoreHorizontal size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Reply form */}
          {replyTo === comment.id && (
            <div className="mt-4 p-3 bg-vj-neutral rounded-lg">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px] mb-2"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
                  Reply
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {/* Replies */}
          {comment.replies?.map(reply => renderComment(reply, true))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-vj-surface rounded-vj-large p-6 border border-vj-border">
      <h3 className="text-lg font-semibold text-vj-primary mb-6">
        Comments ({comments.length})
      </h3>
      
      {/* Add comment form */}
      <div className="mb-8">
        <Textarea
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] mb-3"
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
            <Send size={16} className="mr-2" />
            Post Comment
          </Button>
        </div>
      </div>
      
      {/* Comments list */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-vj-muted">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>
    </div>
  );
};

export default CommentSection;