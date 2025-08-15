import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import UpvoteButton from "@/components/UpvoteButton";
import StatusBadge from "@/components/StatusBadge";
import { ideasAPI, problemsAPI } from "@/lib/api";
import IdeaSubmissionForm from "@/components/IdeaSubmissionForm";

const Ideas = () => {
  const [searchParams] = useSearchParams();
  const problemFilter = searchParams.get("problem");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [sortBy, setSortBy] = useState("upvotes");
  
  // Fetch ideas from API
  const { data: ideasData, isLoading: ideasLoading } = useQuery({
    queryKey: ['ideas', searchTerm, problemFilter, stageFilter, sortBy],
    queryFn: () => ideasAPI.getIdeas({
      search: searchTerm || undefined,
      problemId: problemFilter || undefined,
      stage: stageFilter ? parseInt(stageFilter) : undefined,
      sort: sortBy === 'upvotes' ? 'popular' : sortBy,
      limit: 50
    }),
    staleTime: 5 * 60 * 1000,
  });
  
  // Fetch problem details if filtering by problem
  const { data: problemData } = useQuery({
    queryKey: ['problem', problemFilter],
    queryFn: () => problemsAPI.getProblem(problemFilter!),
    enabled: !!problemFilter,
    staleTime: 10 * 60 * 1000,
  });
  
  const filteredIdeas = ideasData?.data?.ideas || [];
  
  const problemTitle = problemData?.data?.problem?.title;
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <div className="text-center flex-1">
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
          <div className="hidden lg:block">
            <IdeaSubmissionForm />
          </div>
        </div>
        
        {/* Mobile Submit Button */}
        <div className="lg:hidden flex justify-center mb-8">
          <IdeaSubmissionForm />
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
          {ideasLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="vj-card-idea animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-vj-large mb-6"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-16 bg-gray-200 rounded w-full"></div>
                  <div className="h-20 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))
          ) : filteredIdeas.map((idea: any) => (
            <div key={idea.id} className="vj-card-idea group">
              {/* Idea Header with Creative Visual */}
              <div className="aspect-video relative overflow-hidden rounded-vj-large mb-6 bg-gradient-to-br from-idea-light to-idea-primary/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-idea-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-3xl">💡</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-white text-xs font-medium">Idea</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <StatusBadge stage={idea.stage} />
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-1 text-white bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                    <MessageCircle size={12} />
                    <span className="text-xs">{idea.commentsCount || 0}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <UpvoteButton 
                    upvotes={idea.upvoteCount || 0} 
                    downvotes={idea.downvoteCount || 0}
                    showDownvote={true}
                    className="bg-white/90 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-vj-primary mb-2 group-hover:text-idea-primary transition-colors">
                  {idea.title}
                </h3>
                
                <p className="text-vj-muted leading-relaxed">
                  {idea.description}
                </p>
                
                {/* Team */}
                <div>
                  <h4 className="text-sm font-medium text-vj-primary mb-3 flex items-center gap-2">
                    <Users size={16} className="text-idea-primary" />
                    Team Members
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {idea.team.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-idea-light border border-idea-primary/20 px-3 py-2 rounded-full hover:bg-idea-primary/10 transition-colors">
                        <div className="w-6 h-6 rounded-full bg-idea-primary/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-idea-primary">{member.name[0]}</span>
                        </div>
                        <div className="text-xs">
                          <div className="font-medium text-idea-primary">{member.name}</div>
                          <div className="text-idea-muted">{member.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Mentor */}
                {idea.mentor && (
                  <div className="p-3 bg-idea-light rounded-lg border border-idea-primary/20">
                    <p className="text-sm">
                      <span className="font-medium text-idea-primary">🎓 Mentor:</span> 
                      <span className="text-vj-muted ml-1">{idea.mentor}</span>
                    </p>
                  </div>
                )}
                
                <div className="flex gap-3 pt-2">
                  <Link to={`/ideas/${idea._id}`} className="flex-1">
                    <Button size="sm" className="w-full bg-idea-primary hover:bg-idea-primary/90 text-white">
                      View Details
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" className="flex-1 border-idea-primary/30 text-idea-primary hover:bg-idea-light">
                    Contact Team
                  </Button>
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