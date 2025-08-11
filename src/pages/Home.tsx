
import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, Users, TrendingUp, Award, Rocket, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedCounter from "@/components/AnimatedCounter";
import { counters, mockProblems, mockIdeas, mockStartups } from "@/data/mockData";
import heroImage from "@/assets/hero-bg.jpg";

const Home = () => {
  const achievements = [
    {
      icon: Award,
      title: "Best Innovation Award",
      description: "Winner at National Startup Competition 2024",
      year: "2024"
    },
    {
      icon: Rocket,
      title: "5 Startups Funded",
      description: "Total funding raised: $2.8M",
      year: "2024"
    },
    {
      icon: Globe,
      title: "Global Recognition",
      description: "Featured in TechCrunch and Forbes",
      year: "2023"
    }
  ];

  const innovations = [
    {
      title: "AI-Powered Study Assistant",
      category: "EdTech",
      image: "/api/placeholder/300/200",
      description: "Revolutionary learning platform using machine learning"
    },
    {
      title: "Sustainable Campus Energy",
      category: "GreenTech",
      image: "/api/placeholder/300/200", 
      description: "IoT-based energy optimization for university buildings"
    },
    {
      title: "Mental Health Companion",
      category: "HealthTech",
      image: "/api/placeholder/300/200",
      description: "24/7 peer support network with crisis intervention"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center text-center px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url(${heroImage})`,
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

        {/* Floating geometric shapes for visual interest */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-vj-accent/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-vj-accent/5 rounded-lg rotate-45 animate-pulse"></div>
      </section>

      {/* Achievements Section */}
      <section className="py-24 px-4 bg-vj-neutral">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-vj-primary mb-4 font-playfair">
              Our Achievements
            </h2>
            <p className="text-xl text-vj-muted max-w-2xl mx-auto">
              Recognition and milestones that showcase our community's impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="vj-card-minimal text-center group hover-scale">
                <div className="w-16 h-16 bg-vj-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-vj-accent/20 transition-colors">
                  <achievement.icon size={32} className="text-vj-accent" />
                </div>
                <div className="text-sm font-medium text-vj-accent mb-2">{achievement.year}</div>
                <h3 className="text-xl font-semibold text-vj-primary mb-3">{achievement.title}</h3>
                <p className="text-vj-muted">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Innovations */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-vj-primary mb-4 font-playfair">
              Latest Innovations
            </h2>
            <p className="text-xl text-vj-muted max-w-2xl mx-auto">
              Cutting-edge solutions being developed by our student entrepreneurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {innovations.map((innovation, index) => (
              <div key={index} className="group hover-scale">
                <div className="vj-card-minimal overflow-hidden">
                  <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
                    <img 
                      src={innovation.image} 
                      alt={innovation.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-vj-accent text-white text-xs font-medium rounded-full">
                        {innovation.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-vj-primary mb-3">{innovation.title}</h3>
                  <p className="text-vj-muted">{innovation.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 px-4 bg-vj-neutral">
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

      {/* Innovation Stats */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-vj-primary mb-12 font-playfair">
            Innovation by Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-vj-accent mb-2">15+</div>
              <div className="text-sm text-vj-muted">Universities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-vj-accent mb-2">$2.8M</div>
              <div className="text-sm text-vj-muted">Total Funding</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-vj-accent mb-2">95%</div>
              <div className="text-sm text-vj-muted">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-vj-accent mb-2">200+</div>
              <div className="text-sm text-vj-muted">Mentors</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-vj-neutral">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-vj-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Zap size={40} className="text-vj-accent" />
          </div>
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
