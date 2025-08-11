import { useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import UpvoteButton from "@/components/UpvoteButton";
import { mockProblems } from "@/data/mockData";

const Problems = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("upvotes");
  
  // Get all unique tags
  const allTags = Array.from(new Set(mockProblems.flatMap(p => p.tags)));
  
  // Filter and sort problems
  const filteredProblems = mockProblems
    .filter(problem => 
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(problem => 
      selectedTags.length === 0 || 
      selectedTags.some(tag => problem.tags.includes(tag))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "upvotes":
          return b.upvotes - a.upvotes;
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "comments":
          return b.comments - a.comments;
        default:
          return 0;
      }
    });
  
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
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-vj-primary mb-4 font-playfair">
            Problems Worth Solving
          </h1>
          <p className="text-xl text-vj-muted max-w-3xl mx-auto">
            Real challenges identified by our community. Each problem represents an opportunity 
            to create meaningful impact through innovative solutions.
          </p>
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
          {filteredProblems.map(problem => (
            <div key={problem.id} className="vj-card group">
              <div className="flex items-start gap-4">
                <UpvoteButton upvotes={problem.upvotes} className="mt-1" />
                
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {problem.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-vj-primary mb-2 group-hover:text-vj-accent transition-colors">
                    {problem.title}
                  </h3>
                  
                  <p className="text-vj-muted text-sm leading-relaxed mb-4">
                    {problem.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-vj-muted">
                    <span>by {problem.author}</span>
                    <span>{problem.comments} comments</span>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Link to={`/problems/${problem.id}`}>
                      <Button size="sm" className="btn-primary">
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/ideas?problem=${problem.id}`}>
                      <Button size="sm" variant="outline">
                        View Ideas
                      </Button>
                    </Link>
                  </div>
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