import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, TrendingUp, Users, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import UpvoteButton from "@/components/UpvoteButton";
import StatusBadge from "@/components/StatusBadge";
import { mockStartups } from "@/data/mockData";

const Startups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fundingFilter, setFundingFilter] = useState("");
  const [sortBy, setSortBy] = useState("stage");
  
  // Filter and sort startups
  const filteredStartups = mockStartups
    .filter(startup => 
      startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(startup => 
      !fundingFilter || startup.fundingStatus.toLowerCase().includes(fundingFilter.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "stage":
          return b.stage - a.stage;
        case "upvotes":
          return b.upvotes - a.upvotes;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-vj-primary mb-4 font-playfair">
            Success Stories
          </h1>
          <p className="text-xl text-vj-muted max-w-3xl mx-auto">
            From campus ideas to funded companies. Discover the startups that started right here 
            in our community and are now making real impact in the world.
          </p>
        </div>
        
        {/* Filters & Search */}
        <div className="bg-vj-neutral rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vj-muted" size={20} />
              <Input
                placeholder="Search startups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Funding Filter */}
            <select 
              value={fundingFilter}
              onChange={(e) => setFundingFilter(e.target.value)}
              className="bg-background border border-vj-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Funding Stages</option>
              <option value="pre-seed">Pre-Seed</option>
              <option value="seed">Seed</option>
              <option value="series">Series A+</option>
            </select>
            
            {/* Sort */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border border-vj-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="stage">Most Advanced</option>
              <option value="upvotes">Most Popular</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
        
        {/* Startups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredStartups.map(startup => (
            <div key={startup.id} className="vj-card">
              <div className="flex items-start gap-4 mb-6">
                <UpvoteButton upvotes={startup.upvotes} />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <StatusBadge stage={startup.stage} />
                    <Badge variant="outline" className="text-xs">
                      {startup.fundingStatus}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-vj-primary mb-2">
                    {startup.name}
                  </h3>
                  
                  <p className="text-vj-muted leading-relaxed mb-4">
                    {startup.description}
                  </p>
                  
                  {/* Team */}
                  <div className="flex items-center gap-2 mb-4">
                    <Users size={16} className="text-vj-muted" />
                    <div className="flex -space-x-2">
                      {startup.team.slice(0, 3).map((member, index) => (
                        <div 
                          key={index}
                          className="w-8 h-8 bg-vj-accent/10 border-2 border-background rounded-full flex items-center justify-center text-xs font-medium text-vj-accent"
                          title={`${member.name} - ${member.role}`}
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      {startup.team.length > 3 && (
                        <div className="w-8 h-8 bg-vj-muted/10 border-2 border-background rounded-full flex items-center justify-center text-xs text-vj-muted">
                          +{startup.team.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-vj-muted">
                      {startup.team.length} member{startup.team.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {/* Schemes */}
                  {startup.schemes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-vj-muted mb-2">Participated in:</p>
                      <div className="flex flex-wrap gap-1">
                        {startup.schemes.map((scheme, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {scheme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Milestones Preview */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={16} className="text-vj-muted" />
                      <span className="text-sm font-medium text-vj-primary">Recent Milestones</span>
                    </div>
                    <div className="space-y-2">
                      {startup.milestones.slice(-2).map((milestone, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-vj-accent' : 'bg-vj-muted/30'}`}></div>
                          <span className={milestone.completed ? 'text-vj-primary' : 'text-vj-muted'}>
                            {milestone.title}
                          </span>
                          <span className="text-xs text-vj-muted ml-auto">
                            {new Date(milestone.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={`/startups/${startup.id}`}>
                      <Button size="sm" className="btn-primary">
                        View Details
                      </Button>
                    </Link>
                    
                    {startup.onePager && (
                      <Button size="sm" variant="outline" className="gap-2">
                        <Download size={14} />
                        One-Pager
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredStartups.length === 0 && (
          <div className="text-center py-16">
            <p className="text-vj-muted text-lg">No startups match your current filters.</p>
            <Button 
              variant="ghost" 
              onClick={() => { setSearchTerm(""); setFundingFilter(""); }}
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

export default Startups;