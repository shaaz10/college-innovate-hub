import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, MessageCircle, Share2, Bookmark, Eye, Mail, Award, Target, Lightbulb, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpvoteButton from "@/components/UpvoteButton";
import StatusBadge from "@/components/StatusBadge";
import CommentSection from "@/components/CommentSection";
import { mockIdeas, mockProblems, stageLabels, mockComments } from "@/data/mockData";
import foodshareImage from "@/assets/foodshare-idea.jpg";
import mindbridge from "@/assets/mindbridge-idea.jpg";

const imageMap: Record<string, string> = {
  "1": foodshareImage,
  "2": mindbridge,
};

export default function IdeaDetail() {
  const { id } = useParams();
  const idea = mockIdeas.find(p => p.id === id);
  const problem = idea ? mockProblems.find(p => p.id === idea.problemId) : null;
  const [comments, setComments] = useState(mockComments);

  if (!idea) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-vj-primary mb-4">Idea Not Found</h1>
          <Link to="/ideas">
            <Button>Back to Ideas</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddComment = (content: string) => {
    const newComment = {
      id: Date.now().toString(),
      author: "Current User",
      avatar: "/api/placeholder/32/32",
      content,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
    };
    setComments([...comments, newComment]);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
        : comment
    ));
  };

  const handleReply = (commentId: string, content: string) => {
    const newReply = {
      id: `${commentId}-${Date.now()}`,
      author: "Current User",
      avatar: "/api/placeholder/32/32",
      content,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
    };
    
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, replies: [...(comment.replies || []), newReply] }
        : comment
    ));
  };

  const ideaImage = imageMap[idea.id] || "/api/placeholder/800/400";

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to="/ideas" className="inline-flex items-center text-vj-muted hover:text-idea-primary transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Ideas
          </Link>
        </div>

        {/* Idea Header */}
        <div className="vj-card-idea mb-8">
          {/* Idea Image */}
          <div className="aspect-video relative overflow-hidden rounded-vj-large mb-6">
            <img 
              src={ideaImage}
              alt={idea.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute top-6 left-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white text-sm font-medium">Innovation Idea</span>
              </div>
            </div>
            <div className="absolute top-6 right-6">
              <StatusBadge stage={idea.stage} />
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-playfair">
                    {idea.title}
                  </h1>
                  <p className="text-white/90 text-lg">
                    Stage {idea.stage}: {stageLabels[idea.stage - 1]}
                  </p>
                </div>
                <UpvoteButton 
                  upvotes={idea.upvotes} 
                  downvotes={idea.downvotes}
                  showDownvote={true}
                  className="bg-white/90 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 text-sm text-vj-muted">
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>89 views</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>{idea.comments} comments</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 size={16} className="mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark size={16} className="mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Problem Link */}
          {problem && (
            <div className="p-4 bg-idea-light rounded-lg border border-idea-primary/20 mb-6">
              <h3 className="font-semibold mb-2 flex items-center text-idea-primary">
                <Target className="mr-2 h-4 w-4" />
                Addressing Problem
              </h3>
              <Link 
                to={`/problems/${problem.id}`}
                className="text-vj-primary hover:text-idea-primary transition-colors font-medium"
              >
                {problem.title}
              </Link>
            </div>
          )}

          {/* Idea Description */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl font-semibold text-vj-primary mb-4">Solution Overview</h2>
            <p className="text-vj-muted leading-relaxed mb-6">
              {idea.description}
            </p>
          </div>
        </div>

        {/* Detailed Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detailed Solution */}
            <div className="vj-card-idea">
              <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                <Lightbulb className="text-idea-primary" />
                Detailed Solution
              </h3>
              <div className="space-y-4 text-vj-muted">
                <p>
                  {idea.id === "1" ? 
                    "FoodShare Campus leverages AI and real-time data to create a seamless connection between cafeterias with surplus food and students seeking affordable meals. Our platform uses predictive analytics to forecast daily food surplus, automatically adjusting pricing and availability." :
                    "MindBridge creates a comprehensive peer support ecosystem that operates 24/7, connecting students with trained peer counselors and mental health resources. Our platform features crisis intervention protocols, mood tracking, and group therapy sessions."
                  }
                </p>
                <p>
                  {idea.id === "1" ?
                    "The platform includes features like meal quality ratings, dietary preference matching, and carbon footprint tracking to gamify sustainability. Partnership agreements with local food banks ensure broader community impact." :
                    "Key features include guided meditation, stress management workshops, academic pressure support groups, and emergency hotline integration while protecting individual privacy."
                  }
                </p>
              </div>
            </div>

            {/* Market Opportunity */}
            <div className="vj-card-idea">
              <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                <TrendingUp className="text-idea-primary" />
                Market Opportunity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-idea-primary mb-2">Target Market</h4>
                  <p className="text-sm text-vj-muted">
                    {idea.id === "1" ?
                      "4,000+ colleges nationwide with 20M+ students experiencing food insecurity" :
                      "Higher education institutions with 19.6M+ college students, 85% reporting mental health challenges"
                    }
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-idea-primary mb-2">Revenue Model</h4>
                  <p className="text-sm text-vj-muted">
                    {idea.id === "1" ?
                      "Commission on transactions, premium subscriptions, institutional licensing" :
                      "Freemium model, institutional partnerships, crisis intervention premium services"
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Attachments */}
            {idea.attachments.length > 0 && (
              <div className="vj-card-idea">
                <h3 className="text-lg font-semibold text-vj-primary mb-4">Project Materials</h3>
                <div className="space-y-3">
                  {idea.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-idea-light rounded-lg border border-idea-primary/20">
                      <span className="font-medium text-idea-primary">{attachment}</span>
                      <Button size="sm" variant="outline" className="border-idea-primary/30 text-idea-primary hover:bg-idea-light">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team */}
            <div className="vj-card-idea">
              <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                <Users className="text-idea-primary" />
                Team
              </h3>
              <div className="space-y-4">
                {idea.team.map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-idea-primary/20 text-idea-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-vj-primary">{member.name}</p>
                      <p className="text-sm text-idea-muted">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-idea-primary hover:bg-idea-primary/90 text-white">
                <Mail className="mr-2 h-4 w-4" />
                Contact Team
              </Button>
            </div>

            {/* Mentor */}
            {idea.mentor && (
              <div className="vj-card-idea">
                <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                  <Award className="text-idea-primary" />
                  Mentor
                </h3>
                <p className="font-medium text-vj-primary mb-3">{idea.mentor}</p>
                <Button variant="outline" size="sm" className="border-idea-primary/30 text-idea-primary hover:bg-idea-light">
                  Connect
                </Button>
              </div>
            )}

            {/* Engagement Stats */}
            <div className="vj-card-idea">
              <h3 className="text-lg font-semibold text-vj-primary mb-4">Community Engagement</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-vj-muted">Upvotes</span>
                  <span className="font-medium text-idea-primary">{idea.upvotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Comments</span>
                  <span className="font-medium text-idea-primary">{idea.comments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Stage Progress</span>
                  <span className="font-medium text-idea-primary">{Math.round((idea.stage / 9) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection
          comments={comments}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
          onReply={handleReply}
        />
      </div>
    </div>
  );
}