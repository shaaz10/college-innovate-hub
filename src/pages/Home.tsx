import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedCounter from "@/components/AnimatedCounter";
import { counters, mockProblems, mockIdeas, mockStartups } from "@/data/mockData";
import heroImage from "@/assets/hero-bg.jpg";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center text-center px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="hero-quote mb-6">
            Build for the future,<br />start here.
          </h1>
          <p className="hero-subtitle mb-12 max-w-2xl mx-auto">
            Where college entrepreneurs transform problems into startups. 
            Connect, innovate, and shape tomorrow's solutions.
          </p>
          
          {/* Animated Counters */}
          <div className="grid grid-cols-3 gap-8 md:gap-16 mb-12">
            <AnimatedCounter end={counters.startups} duration={2} label="Total Startups" />
            <AnimatedCounter end={counters.students} duration={2.2} label="Students Involved" />
            <AnimatedCounter end={counters.funded} duration={2.4} label="Funded Startups" />
          </div>
          
          <Link to="/problems">
            <Button size="lg" className="btn-primary group">
              Explore Problems
              <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-vj-primary mb-4 font-playfair">
              What's Happening
            </h2>
            <p className="text-xl text-vj-muted max-w-2xl mx-auto">
              Discover the latest problems, innovative ideas, and growing startups from our community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Problems Preview */}
            <div className="vj-card-minimal">
              <div className="flex items-center mb-4">
                <Lightbulb className="text-vj-accent mr-3" size={24} />
                <h3 className="text-xl font-semibold text-vj-primary">Problems</h3>
              </div>
              <p className="text-vj-muted mb-6">
                Real challenges that need solving, identified by students and faculty
              </p>
              <div className="space-y-4 mb-6">
                {mockProblems.slice(0, 2).map(problem => (
                  <div key={problem.id} className="border-l-2 border-vj-accent/20 pl-4">
                    <h4 className="font-medium text-vj-primary text-sm">{problem.title}</h4>
                    <p className="text-xs text-vj-muted mt-1">{problem.upvotes} upvotes</p>
                  </div>
                ))}
              </div>
              <Link to="/problems">
                <Button variant="ghost" className="btn-ghost w-full">
                  View All Problems
                </Button>
              </Link>
            </div>

            {/* Ideas Preview */}
            <div className="vj-card-minimal">
              <div className="flex items-center mb-4">
                <Users className="text-vj-accent mr-3" size={24} />
                <h3 className="text-xl font-semibold text-vj-primary">Ideas</h3>
              </div>
              <p className="text-vj-muted mb-6">
                Innovative solutions being developed by student teams
              </p>
              <div className="space-y-4 mb-6">
                {mockIdeas.slice(0, 2).map(idea => (
                  <div key={idea.id} className="border-l-2 border-vj-accent/20 pl-4">
                    <h4 className="font-medium text-vj-primary text-sm">{idea.title}</h4>
                    <p className="text-xs text-vj-muted mt-1">Stage {idea.stage} • {idea.upvotes} upvotes</p>
                  </div>
                ))}
              </div>
              <Link to="/ideas">
                <Button variant="ghost" className="btn-ghost w-full">
                  View All Ideas
                </Button>
              </Link>
            </div>

            {/* Startups Preview */}
            <div className="vj-card-minimal">
              <div className="flex items-center mb-4">
                <TrendingUp className="text-vj-accent mr-3" size={24} />
                <h3 className="text-xl font-semibold text-vj-primary">Startups</h3>
              </div>
              <p className="text-vj-muted mb-6">
                Successful ventures that grew from ideas to funded companies
              </p>
              <div className="space-y-4 mb-6">
                {mockStartups.slice(0, 2).map(startup => (
                  <div key={startup.id} className="border-l-2 border-vj-accent/20 pl-4">
                    <h4 className="font-medium text-vj-primary text-sm">{startup.name}</h4>
                    <p className="text-xs text-vj-muted mt-1">{startup.fundingStatus}</p>
                  </div>
                ))}
              </div>
              <Link to="/startups">
                <Button variant="ghost" className="btn-ghost w-full">
                  View All Startups
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-vj-neutral">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-vj-primary mb-4 font-playfair">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-vj-muted mb-8">
            Join thousands of student entrepreneurs building tomorrow's solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/submit">
              <Button size="lg" className="btn-primary">
                Submit Your Idea
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" className="btn-secondary">
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;