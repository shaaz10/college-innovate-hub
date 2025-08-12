
import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, Users, TrendingUp, Award, Rocket, Globe, Zap, Sparkles, Brain, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedCounter from "@/components/AnimatedCounter";
import { counters, mockProblems, mockIdeas, mockStartups } from "@/data/mockData";
import innovationHero from "@/assets/innovation-hero.jpg";

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
      image: "/src/assets/studyspace-startup.jpg",
      description: "Revolutionary learning platform using machine learning"
    },
    {
      title: "Sustainable Campus Energy",
      category: "GreenTech",
      image: "/src/assets/ecotrack-startup.jpg", 
      description: "IoT-based energy optimization for university buildings"
    },
    {
      title: "Mental Health Companion",
      category: "HealthTech",
      image: "/src/assets/mindbridge-idea.jpg",
      description: "24/7 peer support network with crisis intervention"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Innovation Focused */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with modern overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${innovationHero})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-vj-surface/98 via-vj-surface/95 to-vj-accent-light/90" />
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-vj-accent/5 rounded-full animate-floating blur-xl" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-vj-accent/8 rounded-vj-large rotate-12 animate-glow" />
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-vj-accent/3 rounded-full animate-floating" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          {/* Innovation badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-vj-accent-light border border-vj-accent/20 rounded-full mb-8 animate-scale-in">
            <Sparkles size={16} className="text-vj-accent" />
            <span className="text-sm font-medium text-vj-accent">Innovation Starts Here</span>
          </div>
          
          <h1 className="hero-quote mb-8 animate-fade-in">
            Build for the future,<br />start here.
          </h1>
          
          <p className="hero-subtitle mb-16 mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Where college entrepreneurs transform problems into breakthrough startups. 
            Connect with innovators, build solutions, and shape tomorrow's world.
          </p>
          
          {/* Animated Counters with modern styling */}
          <div className="grid grid-cols-3 gap-8 md:gap-16 mb-16">
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <AnimatedCounter end={counters.startups} duration={2} label="Innovation Labs" />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <AnimatedCounter end={counters.students} duration={2.2} label="Future Builders" />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <AnimatedCounter end={counters.funded} duration={2.4} label="Success Stories" />
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '1s' }}>
            <Link to="/problems">
              <Button size="lg" className="btn-primary group">
                Explore Problems
                <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/ideas">
              <Button size="lg" className="btn-secondary group">
                View Solutions
                <Brain size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-vj-surface via-vj-neutral to-vj-accent-light/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-vj-accent-light border border-vj-accent/20 rounded-full mb-6">
              <Target size={16} className="text-vj-accent" />
              <span className="text-sm font-medium text-vj-accent">Proven Excellence</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-vj-primary mb-6 font-playfair">
              Innovation Recognition
            </h2>
            <p className="text-xl text-vj-muted max-w-3xl mx-auto leading-relaxed">
              Celebrating breakthrough achievements and milestones that define our community's impact on the future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="vj-card-innovation text-center group">
                <div className="relative w-20 h-20 mx-auto mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-vj-accent to-vj-accent/80 rounded-vj-large flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <achievement.icon size={36} className="text-white" />
                  </div>
                  <div className="absolute inset-0 bg-vj-accent/20 rounded-vj-large animate-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="inline-block px-3 py-1 bg-vj-accent-light text-vj-accent text-xs font-bold rounded-full mb-4">{achievement.year}</div>
                <h3 className="text-2xl font-bold text-vj-primary mb-4">{achievement.title}</h3>
                <p className="text-vj-muted leading-relaxed">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Innovations */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-vj-accent/5 rounded-full animate-floating blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-vj-accent/3 rounded-full animate-floating blur-3xl" style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-vj-accent-light border border-vj-accent/20 rounded-full mb-6">
              <Lightbulb size={16} className="text-vj-accent" />
              <span className="text-sm font-medium text-vj-accent">Innovation Lab</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-vj-primary mb-6 font-playfair">
              Future Technologies
            </h2>
            <p className="text-xl text-vj-muted max-w-3xl mx-auto leading-relaxed">
              Revolutionary solutions being built by next-generation entrepreneurs who dare to reimagine what's possible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {innovations.map((innovation, index) => (
              <div key={index} className="group">
                <div className="vj-card-innovation overflow-hidden relative">
                  {/* Gradient overlay for premium feel */}
                  <div className="absolute inset-0 bg-gradient-to-br from-vj-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="aspect-video relative overflow-hidden rounded-vj-large mb-8">
                    <img 
                      src={innovation.image} 
                      alt={innovation.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-vj-accent text-white text-sm font-bold rounded-full shadow-lg">
                        {innovation.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <h3 className="text-2xl font-bold text-vj-primary mb-4 group-hover:text-vj-accent transition-colors duration-300">{innovation.title}</h3>
                    <p className="text-vj-muted leading-relaxed">{innovation.description}</p>
                    
                    <div className="mt-6 flex items-center text-vj-accent group-hover:translate-x-2 transition-transform duration-300">
                      <span className="text-sm font-semibold">Explore Innovation</span>
                      <ArrowRight size={16} className="ml-2" />
                    </div>
                  </div>
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
