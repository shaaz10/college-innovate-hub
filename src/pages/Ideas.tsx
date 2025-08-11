import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import UpvoteButton from "@/components/UpvoteButton";
import StatusBadge from "@/components/StatusBadge";
import { mockIdeas, mockProblems } from "@/data/mockData";

const Ideas = () => {
  const [searchParams] = useSearchParams();
  const problemFilter = searchParams.get("problem");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [sortBy, setSortBy] = useState("upvotes");
  
  // Filter and sort ideas
  const filteredIdeas = mockIdeas
    .filter(idea => 
      !problemFilter || idea.problemId === problemFilter
    )
    .filter(idea => 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(idea => 
      !stageFilter || idea.stage.toString() === stageFilter
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "upvotes":
          return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        case "stage":
          return b.stage - a.stage;
        case "comments":
          return b.comments - a.comments;
        default:
          return 0;
      }
    });
  
  const problemTitle = problemFilter 
    ? mockProblems.find(p => p.id === problemFilter)?.title 
    : null;
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-vj-primary mb-4 font-playfair">
            {problemFilter ? `Ideas for: ${problemTitle}` : "Innovative Ideas"}
          </h1>
          <p className="text-xl text-vj-muted max-w-3xl mx-auto">
            {problemFilter 
              ? "Student teams working on solutions for this specific problem"
              : "Discover innovative solutions being developed by student entrepreneurs across all problem areas"
            }
          </p>
        </div>
        
        {/* Filters & Search */}
        <div className="bg-vj-neutral rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vj-muted" size={20} />
              <Input
                placeholder="Search ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Stage Filter */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-vj-muted" />
              <select 
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="bg-background border border-vj-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">All Stages</option>
                <option value="1">Ideation</option>
                <option value="2">Research</option>
                <option value="3">Validation</option>
                <option value="4">Prototype</option>
                <option value="5">Testing</option>
                <option value="6">Launch Prep</option>
                <option value="7">MVP Launch</option>
                <option value="8">Growth</option>
                <option value="9">Scale/Exit</option>
              </select>
            </div>
            
            {/* Sort */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border border-vj-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="upvotes">Highest Rated</option>
              <option value="stage">Most Advanced</option>
              <option value="comments">Most Discussed</option>
            </select>
          </div>
        </div>
        
        {/* Ideas Grid */}
        <div className="ideas-grid">
          {filteredIdeas.map(idea => (
            <div key={idea.id} className="vj-card">
              <div className="flex items-start gap-4 mb-4">
                <UpvoteButton 
                  upvotes={idea.upvotes} 
                  downvotes={idea.downvotes}
                  showDownvote={true}
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <StatusBadge stage={idea.stage} />
                    <div className="flex items-center gap-1 text-xs text-vj-muted">
                      <MessageCircle size={14} />
                      <span>{idea.comments}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-vj-primary mb-2">
                    {idea.title}
                  </h3>
                  
                  <p className="text-vj-muted text-sm leading-relaxed mb-4">
                    {idea.description}
                  </p>
                  
                  {/* Team */}
                  <div className="flex items-center gap-2 mb-4">
                    <Users size={16} className="text-vj-muted" />
                    <div className="flex -space-x-2">
                      {idea.team.slice(0, 3).map((member, index) => (
                        <div 
                          key={index}
                          className="w-8 h-8 bg-vj-accent/10 border-2 border-background rounded-full flex items-center justify-center text-xs font-medium text-vj-accent"
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      {idea.team.length > 3 && (
                        <div className="w-8 h-8 bg-vj-muted/10 border-2 border-background rounded-full flex items-center justify-center text-xs text-vj-muted">
                          +{idea.team.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-vj-muted">
                      {idea.team.length} member{idea.team.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {/* Mentor */}
                  {idea.mentor && (
                    <div className="mb-4">
                      <Badge variant="outline" className="text-xs">
                        Mentor: {idea.mentor}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Link to={`/ideas/${idea.id}`}>
                      <Button size="sm" className="btn-primary">
                        View Details
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline">
                      Contact Team
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredIdeas.length === 0 && (
          <div className="text-center py-16">
            <p className="text-vj-muted text-lg">
              {problemFilter ? "No ideas found for this problem yet." : "No ideas match your current filters."}
            </p>
            <div className="flex gap-4 justify-center mt-4">
              {problemFilter && (
                <Link to="/submit">
                  <Button className="btn-primary">
                    Submit First Idea
                  </Button>
                </Link>
              )}
              <Button 
                variant="ghost" 
                onClick={() => { setSearchTerm(""); setStageFilter(""); }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ideas;