import { useParams, Link } from "react-router-dom";
import { mockStartups, stageLabels } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusBadge from "@/components/StatusBadge";
import UpvoteButton from "@/components/UpvoteButton";
import { ArrowLeft, MessageCircle, Users, FileText, Download, Award, TrendingUp, Target, Building, Calendar, CheckCircle } from "lucide-react";
import studyspaceImage from "@/assets/studyspace-startup.jpg";
import ecotrackImage from "@/assets/ecotrack-startup.jpg";

const imageMap: Record<string, string> = {
  "1": studyspaceImage,
  "2": ecotrackImage,
};

export default function StartupDetail() {
  const { id } = useParams();
  const startup = mockStartups.find(s => s.id === id);

  if (!startup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Startup Not Found</h1>
          <p className="text-muted-foreground mb-6">The startup you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/startups">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Startups
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const startupImage = imageMap[startup.id] || "/api/placeholder/800/400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-vj-background via-vj-background to-vj-surface">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/startups">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Startups
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <Card>
              <CardContent className="p-0">
                <img 
                  src={startupImage} 
                  alt={startup.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <StatusBadge stage={startup.stage} />
                      <span className="text-sm text-muted-foreground">
                        Stage {startup.stage}: {stageLabels[startup.stage - 1]}
                      </span>
                    </div>
                    <UpvoteButton 
                      upvotes={startup.upvotes}
                    />
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-2">{startup.name}</h1>
                  <p className="text-lg text-muted-foreground mb-4">{startup.description}</p>
                  
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">{startup.fundingStatus}</Badge>
                    {startup.onePager && (
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        One-Pager
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Company Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  {startup.id === "1" ? 
                    "StudySpace revolutionizes how students access and utilize study spaces through AI-powered room booking and collaborative learning features. Our platform eliminates the frustration of finding available study rooms by providing real-time availability, smart scheduling, and personalized recommendations based on study preferences and group size." :
                    "EcoTrack Campus provides comprehensive sustainability tracking and carbon footprint reduction tools specifically designed for college campuses. Our platform helps institutions monitor energy consumption, waste management, transportation patterns, and overall environmental impact while engaging students in campus-wide sustainability initiatives."
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Key Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {startup.id === "1" ? (
                        <>
                          <li>• AI-powered room recommendations</li>
                          <li>• Real-time availability tracking</li>
                          <li>• Group study matching</li>
                          <li>• Study session analytics</li>
                        </>
                      ) : (
                        <>
                          <li>• Carbon footprint tracking</li>
                          <li>• Energy consumption monitoring</li>
                          <li>• Waste management analytics</li>
                          <li>• Student engagement features</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Technology Stack</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {startup.id === "1" ? (
                        <>
                          <li>• React Native mobile app</li>
                          <li>• Machine learning algorithms</li>
                          <li>• IoT sensor integration</li>
                          <li>• Cloud infrastructure</li>
                        </>
                      ) : (
                        <>
                          <li>• IoT environmental sensors</li>
                          <li>• Data analytics platform</li>
                          <li>• Mobile and web applications</li>
                          <li>• API integrations</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Market Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Market Size</h4>
                    <p className="text-2xl font-bold text-primary">
                      {startup.id === "1" ? "$1.2B" : "$800M"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {startup.id === "1" ? "Campus space management" : "Campus sustainability"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Target Customers</h4>
                    <p className="text-sm text-muted-foreground">
                      {startup.id === "1" ? 
                        "Universities, students, facility managers" :
                        "Higher ed institutions, sustainability offices"
                      }
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Growth Rate</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {startup.id === "1" ? "15%" : "22%"}
                    </p>
                    <p className="text-sm text-muted-foreground">Annual CAGR</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Milestones & Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {startup.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`p-1 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-muted'}`}>
                        <CheckCircle className={`h-4 w-4 ${milestone.completed ? 'text-white' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${milestone.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {milestone.title}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {milestone.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Leadership Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {startup.team.map((member, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Funding & Schemes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Funding & Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-primary">{startup.fundingStatus}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Support Schemes</h4>
                    <div className="space-y-1">
                      {startup.schemes.map((scheme, index) => (
                        <Badge key={index} variant="secondary" className="mr-1">
                          {scheme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Interested in {startup.name}?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with the team for partnerships, investment opportunities, or collaboration.
                </p>
                <div className="space-y-2">
                  <Button className="w-full">Schedule Meeting</Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                  {startup.onePager && (
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Pitch Deck
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Company Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Company Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Community Support</span>
                    <span className="font-medium">{startup.upvotes} upvotes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Development Stage</span>
                    <span className="font-medium">{Math.round((startup.stage / 9) * 100)}% complete</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Team Size</span>
                    <span className="font-medium">{startup.team.length} members</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Milestones Achieved</span>
                    <span className="font-medium">
                      {startup.milestones.filter(m => m.completed).length}/{startup.milestones.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}