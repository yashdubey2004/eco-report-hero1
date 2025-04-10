import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Star,
  Bell,
  PlusCircle,
} from "lucide-react";
import supabase from "../supabaseClient";
import { Link } from "react-router-dom";
import type { Report } from "../types/database";

const DashboardPreviewSection = () => {
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [userImpact, setUserImpact] = useState({
    reportsSubmitted: 0,
    reportsSubmittedChange: 0,
    wasteCollected: "0 kg",
    leaderboardRank: "#0",
  });

  // -------------------------
  // FETCH LATEST 3 REPORTS
  // -------------------------
  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3); // Fetch only the latest 3 reports
    if (!error && data) {
      setUserReports(data);
    } else if (error) {
      console.error("Error fetching user reports:", error);
    }
  };

  // -------------------------
  // REALTIME SUBSCRIPTION
  // -------------------------
  useEffect(() => {
    fetchReports();
    const reportsChannel = supabase
      .channel("realtime:reports-preview")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, () => {
        fetchReports();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(reportsChannel);
    };
  }, []);

  // -------------------------
  // HANDLERS
  // -------------------------
  const handleNotificationsClick = () => {
    console.log("Notifications clicked");
  };

  const handleNewReportClick = () => {
    console.log("New Report clicked");
  };

  // -------------------------
  // UI RENDER
  // -------------------------
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
            </TabsList>
          </div>

          <TabsContent value="user" className="space-y-8">
            <Card className="glass-card border-0 overflow-hidden">
              <CardHeader className="border-b border-border pb-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle>User Dashboard</CardTitle>
                    <CardDescription>Monitor your reports and impact</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={handleNotificationsClick}>
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                      onClick={handleNewReportClick}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Report
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* LEFT: RECENT REPORTS */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-4">Recent Reports</h3>
                    <div className="space-y-4">
                      {userReports.length > 0 ? (
                        userReports.map((report) => (
                          <div
                            key={report.id}
                            className="flex gap-4 p-6 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors shadow-md"
                          >
                            <div className="w-24 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                              <img
                                src={report.photo}
                                alt={report.description || "Waste report image"}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium truncate">
                                  {report.description || "Report"}
                                </h4>
                                <Badge
                                  variant={
                                    report.status === "completed"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className={
                                    report.status === "completed"
                                      ? "bg-green-500/80 text-white flex-shrink-0"
                                      : "flex-shrink-0"
                                  }
                                >
                                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {report.location || "Location not provided"}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">No recent reports found.</p>
                      )}
                    </div>
                    <Button variant="link" className="mt-4 px-0 text-primary" asChild>
                      <Link to="/all-reports">
                        View all reports <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>

                  {/* RIGHT: USER IMPACT */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Your Impact</h3>
                    <div className="space-y-4">
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">Reports Submitted</h4>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-2xl font-bold">
                            {userImpact.reportsSubmitted}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {userImpact.reportsSubmitted > 0
                              ? `$${userImpact.reportsSubmittedChange} this month`
                              : ""}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">Waste Collected</h4>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-2xl font-bold">
                            {userImpact.wasteCollected}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Saved from landfill
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">Leaderboard Rank</h4>
                            <Star className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-2xl font-bold">
                            {userImpact.leaderboardRank}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Top 5% of contributors
                          </p>
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
