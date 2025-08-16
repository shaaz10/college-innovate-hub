import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Filter, Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import UpvoteButton from "@/components/UpvoteButton";
import ProblemSubmissionForm from "@/components/ProblemSubmissionForm";
import { supabase } from "@/integrations/supabase/client";

const Problems = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("upvotes");
  
  // Fetch problems from Supabase
  const { data: problems = [], isLoading, error } = useQuery({
    queryKey: ['problems', searchTerm, selectedTags, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('problems')
        .select(`
          *,
          profiles!problems_user_id_fkey (
            first_name,
            last_name,
            full_name
          )
        `);

      // Apply search filter
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Apply tag filter
      if (selectedTags.length > 0) {
        query = query.overlaps('tags', selectedTags);
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'upvotes':
        default:
          query = query.order('upvotes', { ascending: false });
          break;
      }

      const { data, error } = await query.limit(50);
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Get all unique tags from fetched problems
  const allTags: string[] = Array.from(new Set(problems.flatMap((p: any) => p.tags || [])));
  
  // Filter and sort problems (already handled in query)
  const filteredProblems = problems;
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-vj-primary mb-4 font-playfair">
              Problems Worth Solving
            </h1>
            <p className="text-xl text-vj-muted max-w-3xl mx-auto">
              Real challenges identified by our community. Each problem represents an opportunity 
              to create meaningful impact through innovative solutions.
            </p>
          </div>
          <div className="hidden lg:block">
            <ProblemSubmissionForm />
          </div>
        </div>
        
        {/* Mobile Submit Button */}
        <div className="lg:hidden flex justify-center mb-8">
          <ProblemSubmissionForm />
        </div>
        
        {/* Filters & Search */}
        <div className="bg-vj-neutral rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vj-muted" size={20} />
              <Input
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={16} className="text-vj-muted" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-vj-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="upvotes">Most Upvoted</option>
                <option value="newest">Newest</option>
                <option value="comments">Most Discussed</option>
              </select>
            </div>
          </div>
          
          {/* Tags */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={16} className="text-vj-muted" />
              <span className="text-sm font-medium text-vj-primary">Filter by tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer transition-all"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Problems Grid */}
        <div className="problems-grid">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="vj-card-problem animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-vj-large mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                  <div className="h-16 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-16">
              <p className="text-red-500 text-lg">Failed to load problems. Please try again.</p>
            </div>
          ) : filteredProblems.map((problem: any) => (
            <div key={problem.id} className="vj-card-problem group">
              {/* Problem Image */}
              <div className="aspect-video relative overflow-hidden rounded-vj-large mb-6">
                <img 
                  src={problem.image || `/src/assets/food-waste-problem.jpg`}
                  alt={problem.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    <span className="text-white text-xs font-medium">Problem</span>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <UpvoteButton 
                    upvotes={problem.upvotes || 0} 
                    className="bg-white/90 backdrop-blur-sm" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs border-problem-primary/30 text-problem-primary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <h3 className="text-xl font-bold text-vj-primary mb-2 group-hover:text-problem-primary transition-colors">
                  {problem.title}
                </h3>
                
                <p className="text-vj-muted leading-relaxed">
                  {problem.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-vj-muted pt-4 border-t border-vj-border/50">
                  <span>by {problem.profiles?.full_name || problem.profiles?.first_name + ' ' + problem.profiles?.last_name}</span>
                  <span>{problem.commentsCount || 0} comments</span>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Link to={`/problems/${problem.id}`} className="flex-1">
                    <Button size="sm" className="w-full bg-problem-primary hover:bg-problem-primary/90 text-white">
                      View Details
                    </Button>
                  </Link>
                  <Link to={`/ideas?problem=${problem.id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full border-problem-primary/30 text-problem-primary hover:bg-problem-light">
                      View Ideas
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProblems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-vj-muted text-lg">No problems match your current filters.</p>
            <Button 
              variant="ghost" 
              onClick={() => { setSearchTerm(""); setSelectedTags([]); }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;