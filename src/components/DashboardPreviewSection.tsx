
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, ArrowRight, Users, BarChart3, MessageSquare, Star } from "lucide-react";

const DashboardPreviewSection = () => {
  return (
    <section id="dashboard" className="section-padding">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Dashboard Experience</h2>
          <p className="text-muted-foreground">
            Track your reports, connect with NGOs, and monitor your environmental impact
          </p>
        </div>

        <Tabs defaultValue="user" className="w-full">
          <div className="flex justify-center">
            <TabsList className="mb-8">
              <TabsTrigger value="user">User Dashboard</TabsTrigger>
              <TabsTrigger value="ngo">NGO Dashboard</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="user" className="space-y-8">
            <Card className="glass-card border-0 overflow-hidden">
              <CardHeader className="border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Dashboard</CardTitle>
                    <CardDescription>Monitor your reports and impact</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button size="sm" variant="outline">Notifications</Button>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">New Report</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-4">Recent Reports</h3>
                    <div className="space-y-4">
                      {[
                        { 
                          image: "https://images.unsplash.com/photo-1605600659453-259e424b6f12?w=400&h=300&fit=crop&crop=entropy&q=80",
                          title: "Plastic bottles near river bank", 
                          type: "Plastic",
                          status: "Picked Up",
                          date: "Apr 02, 2025",
                          ngo: "CleanOcean Initiative"
                        },
                        { 
                          image: "https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?w=400&h=300&fit=crop&crop=entropy&q=80",
                          title: "Abandoned electronics", 
                          type: "E-Waste",
                          status: "Scheduled",
                          date: "Mar 28, 2025",
                          ngo: "TechReclaim"
                        },
                        { 
                          image: "https://images.unsplash.com/photo-1542601098-8fc114e148e2?w=400&h=300&fit=crop&crop=entropy&q=80",
                          title: "Glass bottles in park", 
                          type: "Glass",
                          status: "Pending",
                          date: "Mar 25, 2025",
                          ngo: "Awaiting match"
                        }
                      ].map((report, index) => (
                        <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="w-24 h-16 rounded-md overflow-hidden">
                            <img 
                              src={report.image} 
                              alt={report.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{report.title}</h4>
                              <Badge 
                                variant={report.status === "Picked Up" ? "default" : 
                                       report.status === "Scheduled" ? "outline" : "secondary"}
                                className={report.status === "Picked Up" ? "bg-green-500" : ""}
                              >
                                {report.status === "Picked Up" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                {report.status === "Scheduled" && <Clock className="h-3 w-3 mr-1" />}
                                {report.status}
                              </Badge>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <span className="rounded-full px-2 py-0.5 bg-primary/10 text-primary mr-2">{report.type}</span>
                              <span>{report.date}</span>
                              <span className="mx-2">•</span>
                              <span>{report.ngo}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="link" className="mt-2 text-primary">
                      View all reports <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Your Impact</h3>
                    <div className="space-y-4">
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">Reports Submitted</h4>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-2xl font-bold">12</p>
                          <p className="text-xs text-muted-foreground">+3 this month</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">Waste Collected</h4>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-2xl font-bold">18.3 kg</p>
                          <p className="text-xs text-muted-foreground">Saved from landfill</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">Leaderboard Rank</h4>
                            <Star className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-2xl font-bold">#42</p>
                          <p className="text-xs text-muted-foreground">Top 5% of contributors</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ngo" className="space-y-8">
            <Card className="glass-card border-0 overflow-hidden">
              <CardHeader className="border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>NGO Dashboard</CardTitle>
                    <CardDescription>Manage waste collection requests</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button size="sm" variant="outline">Reports</Button>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">Manage Pickups</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-4">Pickup Requests</h3>
                    <div className="space-y-4">
                      {[
                        { 
                          image: "https://images.unsplash.com/photo-1627736292074-2fa24c2589d9?w=400&h=300&fit=crop&crop=entropy&q=80",
                          title: "Mixed recyclables", 
                          type: "Mixed",
                          location: "43 Park Avenue",
                          distance: "1.2 km",
                          status: "New Request",
                          reporter: "Alex Johnson"
                        },
                        { 
                          image: "https://images.unsplash.com/photo-1571727153934-b9e0059b7ab2?w=400&h=300&fit=crop&crop=entropy&q=80",
                          title: "Metal containers", 
                          type: "Metal",
                          location: "128 West Street",
                          distance: "0.8 km",
                          status: "New Request",
                          reporter: "Maria Smith"
                        },
                        { 
                          image: "https://images.unsplash.com/photo-1519687079572-f3e786da908e?w=400&h=300&fit=crop&crop=entropy&q=80",
                          title: "Paper waste", 
                          type: "Paper",
                          location: "92 East Road",
                          distance: "2.3 km",
                          status: "Scheduled",
                          reporter: "John Davis"
                        }
                      ].map((request, index) => (
                        <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="w-24 h-16 rounded-md overflow-hidden">
                            <img 
                              src={request.image} 
                              alt={request.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{request.title}</h4>
                              <Badge 
                                variant={request.status === "New Request" ? "default" : "outline"}
                                className={request.status === "New Request" ? "bg-eco-blue" : ""}
                              >
                                {request.status}
                              </Badge>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <span className="rounded-full px-2 py-0.5 bg-primary/10 text-primary mr-2">{request.type}</span>
                              <span>{request.location}</span>
                              <span className="mx-2">•</span>
                              <span>{request.distance} away</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs">By: {request.reporter}</span>
                              <Button size="sm" variant="outline" className="h-7 text-xs">
                                Respond
                                <MessageSquare className="ml-1 h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="link" className="mt-2 text-primary">
                      View all requests <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">NGO Performance</h3>
                    <div className="space-y-4">
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">Pickups Completed</h4>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-2xl font-bold">38</p>
                          <p className="text-xs text-muted-foreground">+12 this month</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">Active Reporters</h4>
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-2xl font-bold">24</p>
                          <p className="text-xs text-muted-foreground">People in your area</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">Response Rate</h4>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-2xl font-bold">93%</p>
                          <p className="text-xs text-muted-foreground">Average response time: 2h</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default DashboardPreviewSection;
