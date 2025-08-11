import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, TrendingUp, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UpvoteButton from "@/components/UpvoteButton";
import { mockProblems, mockIdeas } from "@/data/mockData";

const ProblemDetail = () => {
  const { id } = useParams();
  const problem = mockProblems.find(p => p.id === id);
  const relatedIdeas = mockIdeas.filter(idea => idea.problemId === id);
  
  if (!problem) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-vj-primary mb-4">Problem Not Found</h1>
          <Link to="/problems">
            <Button>Back to Problems</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Navigation */}
        <Link 
          to="/problems" 
          className="inline-flex items-center text-vj-muted hover:text-vj-primary transition-colors mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Problems
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {problem.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-vj-primary mb-4 font-playfair">
                {problem.title}
              </h1>
              
              <div className="flex items-center gap-6 text-sm text-vj-muted mb-6">
                <span>Posted by {problem.author}</span>
                <span>{new Date(problem.date).toLocaleDateString()}</span>
                <div className="flex items-center gap-1">
                  <MessageCircle size={16} />
                  <span>{problem.comments} comments</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <UpvoteButton upvotes={problem.upvotes} />
                <p className="text-lg text-vj-muted leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>
            
            {/* Hero Image Placeholder */}
            <div className="bg-vj-neutral rounded-xl h-64 mb-8 flex items-center justify-center">
              <span className="text-vj-muted">Problem Illustration</span>
            </div>
            
            {/* Problem Sections */}
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-vj-primary mb-4 flex items-center">
                  <div className="w-1 h-6 bg-vj-accent rounded-full mr-3"></div>
                  Background
                </h2>
                <p className="text-vj-muted leading-relaxed">{problem.background}</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-vj-primary mb-4 flex items-center">
                  <div className="w-1 h-6 bg-vj-accent rounded-full mr-3"></div>
                  Scalability
                </h2>
                <p className="text-vj-muted leading-relaxed">{problem.scalability}</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-vj-primary mb-4 flex items-center">
                  <TrendingUp className="text-vj-accent mr-3" size={20} />
                  Market Size & Stats
                </h2>
                <div className="bg-vj-neutral rounded-xl p-6">
                  <p className="text-vj-primary font-medium text-lg">{problem.marketSize}</p>
                  <div className="mt-4 h-32 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-vj-muted">Market Analysis Chart</span>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-vj-primary mb-4 flex items-center">
                  <div className="w-1 h-6 bg-vj-accent rounded-full mr-3"></div>
                  Competitor Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {problem.competitors.map((competitor, index) => (
                    <div key={index} className="vj-card-minimal flex items-center justify-between">
                      <span className="font-medium text-vj-primary">{competitor}</span>
                      <ExternalLink size={16} className="text-vj-muted" />
                    </div>
                  ))}
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-vj-primary mb-4 flex items-center">
                  <div className="w-1 h-6 bg-vj-accent rounded-full mr-3"></div>
                  Why Current Solutions Fall Short
                </h2>
                <p className="text-vj-muted leading-relaxed">{problem.currentGaps}</p>
              </section>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Related Ideas */}
              <div className="vj-card">
                <h3 className="text-xl font-semibold text-vj-primary mb-4 flex items-center">
                  <Users className="text-vj-accent mr-3" size={20} />
                  Related Ideas ({relatedIdeas.length})
                </h3>
                
                {relatedIdeas.length > 0 ? (
                  <div className="space-y-4">
                    {relatedIdeas.slice(0, 3).map(idea => (
                      <Link 
                        key={idea.id} 
                        to={`/ideas/${idea.id}`}
                        className="block p-3 bg-vj-neutral rounded-lg hover:bg-vj-border transition-colors"
                      >
                        <h4 className="font-medium text-vj-primary text-sm mb-1">{idea.title}</h4>
                        <p className="text-xs text-vj-muted">
                          Stage {idea.stage} • {idea.upvotes} upvotes
                        </p>
                      </Link>
                    ))}
                    
                    <Link to={`/ideas?problem=${id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View All Ideas
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-vj-muted text-sm mb-4">
                      No ideas yet for this problem. Be the first to propose a solution!
                    </p>
                    <Link to="/submit">
                      <Button size="sm" className="btn-primary">
                        Submit Idea
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Mentor Callout */}
              <div className="vj-card border-l-4 border-vj-accent">
                <h3 className="font-semibold text-vj-primary mb-2">Need Guidance?</h3>
                <p className="text-sm text-vj-muted mb-4">
                  Connect with experienced mentors who can help you tackle this problem.
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Find Mentors
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;