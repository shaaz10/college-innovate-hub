import { useParams, Link } from "react-router-dom";
import { mockIdeas, mockProblems, stageLabels } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusBadge from "@/components/StatusBadge";
import UpvoteButton from "@/components/UpvoteButton";
import { ArrowLeft, MessageCircle, Users, FileText, Mail, Award, Target, Lightbulb, TrendingUp } from "lucide-react";
import foodshareImage from "@/assets/foodshare-idea.jpg";
import mindbridge from "@/assets/mindbridge-idea.jpg";

const imageMap: Record<string, string> = {
  "1": foodshareImage,
  "2": mindbridge,
};

export default function IdeaDetail() {
  const { id } = useParams();
  const idea = mockIdeas.find(p => p.id === id);
  const problem = idea ? mockProblems.find(p => p.id === idea.problemId) : null;

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Idea Not Found</h1>
          <p className="text-muted-foreground mb-6">The idea you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/ideas">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Ideas
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const ideaImage = imageMap[idea.id] || "/api/placeholder/800/400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-vj-background via-vj-background to-vj-surface">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/ideas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Ideas
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <Card>
              <CardContent className="p-0">
                <img 
                  src={ideaImage} 
                  alt={idea.title}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <StatusBadge stage={idea.stage} />
                      <span className="text-sm text-muted-foreground">
                        Stage {idea.stage}: {stageLabels[idea.stage - 1]}
                      </span>
                    </div>
                    <UpvoteButton 
                      upvotes={idea.upvotes} 
                      downvotes={idea.downvotes}
                      showDownvote={true}
                    />
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-4">{idea.title}</h1>
                  <p className="text-lg text-muted-foreground mb-6">{idea.description}</p>
                  
                  {problem && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Target className="mr-2 h-4 w-4" />
                        Addressing Problem
                      </h3>
                      <Link 
                        to={`/problems/${problem.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {problem.title}
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Solution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Solution Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  {idea.id === "1" ? 
                    "FoodShare Campus leverages AI and real-time data to create a seamless connection between cafeterias with surplus food and students seeking affordable meals. Our platform uses predictive analytics to forecast daily food surplus, automatically adjusting pricing and availability. Students receive push notifications about discounted meals available for pickup, reducing waste while providing accessible nutrition options." :
                    "MindBridge creates a comprehensive peer support ecosystem that operates 24/7, connecting students with trained peer counselors and mental health resources. Our platform features crisis intervention protocols, mood tracking, group therapy sessions, and seamless integration with campus counseling services. The system uses AI to match students with appropriate support levels while maintaining complete anonymity and privacy."
                  }
                </p>
                <p>
                  {idea.id === "1" ?
                    "The platform includes features like meal quality ratings, dietary preference matching, and carbon footprint tracking to gamify sustainability. Partnership agreements with local food banks ensure that any remaining surplus reaches broader community networks." :
                    "Key features include guided meditation, stress management workshops, academic pressure support groups, and emergency hotline integration. The platform also provides analytics to campus administrators about student mental health trends while protecting individual privacy."
                  }
                </p>
              </CardContent>
            </Card>

            {/* Market Opportunity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Market Opportunity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Target Market</h4>
                    <p className="text-sm text-muted-foreground">
                      {idea.id === "1" ?
                        "4,000+ colleges nationwide with 20M+ students experiencing food insecurity" :
                        "Higher education institutions with 19.6M+ college students, 85% reporting mental health challenges"
                      }
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Revenue Model</h4>
                    <p className="text-sm text-muted-foreground">
                      {idea.id === "1" ?
                        "Commission on transactions, premium subscriptions, institutional licensing" :
                        "Freemium model, institutional partnerships, crisis intervention premium services"
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            {idea.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Project Materials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {idea.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">{attachment}</span>
                        <Button size="sm" variant="outline" className="ml-auto">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {idea.team.map((member, index) => (
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
                <Button className="w-full mt-4" asChild>
                  <a href={`mailto:${idea.contact}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Team
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Mentor */}
            {idea.mentor && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Mentor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{idea.mentor}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Connect
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Engagement Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Community Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Upvotes</span>
                    <span className="font-medium">{idea.upvotes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Comments</span>
                    <span className="font-medium">{idea.comments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stage Progress</span>
                    <span className="font-medium">{Math.round((idea.stage / 9) * 100)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Interested in this idea?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with the team or provide feedback to help them grow.
                </p>
                <div className="space-y-2">
                  <Button className="w-full">Join Project</Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Leave Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}