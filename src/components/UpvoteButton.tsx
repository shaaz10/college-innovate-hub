import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpvoteButtonProps {
  upvotes: number;
  downvotes?: number;
  onUpvote?: () => void;
  onDownvote?: () => void;
  showDownvote?: boolean;
  className?: string;
}

const UpvoteButton = ({ 
  upvotes, 
  downvotes = 0, 
  onUpvote, 
  onDownvote, 
  showDownvote = false,
  className = ""
}: UpvoteButtonProps) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [currentUpvotes, setCurrentUpvotes] = useState(upvotes);
  const [currentDownvotes, setCurrentDownvotes] = useState(downvotes);
  
  const handleUpvote = () => {
    if (isUpvoted) {
      setCurrentUpvotes(prev => prev - 1);
      setIsUpvoted(false);
    } else {
      setCurrentUpvotes(prev => prev + 1);
      setIsUpvoted(true);
      if (isDownvoted) {
        setCurrentDownvotes(prev => prev - 1);
        setIsDownvoted(false);
      }
    }
    onUpvote?.();
  };
  
  const handleDownvote = () => {
    if (isDownvoted) {
      setCurrentDownvotes(prev => prev - 1);
      setIsDownvoted(false);
    } else {
      setCurrentDownvotes(prev => prev + 1);
      setIsDownvoted(true);
      if (isUpvoted) {
        setCurrentUpvotes(prev => prev - 1);
        setIsUpvoted(false);
      }
    }
    onDownvote?.();
  };
  
  return (
    <div className={`flex flex-col items-center space-y-1 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleUpvote}
        className={`p-1 h-8 w-8 transition-all duration-200 ${
          isUpvoted 
            ? 'text-vj-accent bg-vj-accent/10 hover:bg-vj-accent/20' 
            : 'text-vj-muted hover:text-vj-accent hover:bg-vj-accent/10'
        }`}
      >
        <ChevronUp size={16} />
      </Button>
      
      <span className="text-sm font-medium text-vj-primary min-w-[24px] text-center">
        {currentUpvotes}
      </span>
      
      {showDownvote && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownvote}
            className={`p-1 h-8 w-8 transition-all duration-200 ${
              isDownvoted 
                ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                : 'text-vj-muted hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <ChevronDown size={16} />
          </Button>
          
          <span className="text-sm font-medium text-vj-muted min-w-[24px] text-center">
            {currentDownvotes}
          </span>
        </>
      )}
    </div>
  );
};

export default UpvoteButton;