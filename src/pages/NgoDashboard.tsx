import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { Button } from "@/components/ui/button";
import Navigation from "../components/Navigation"; // Assuming Navigation is needed here
import { toast } from "@/hooks/use-toast"; // Assuming use-toast hook is set up
import type { Report } from "../types/database";
// Import Table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // Import Badge for status
// Import Card components and additional icons
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Package, Trash2, MapPin as MapPinIcon, BarChartHorizontal } from "lucide-react"; // Added MapPinIcon, BarChartHorizontal

const NgoDashboardPage = () => { // Renamed component slightly to avoid confusion if the other file exists
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // -------------------------
  // FETCH REPORTS
  // -------------------------
  const fetchReports = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false }); // newest first

    if (error) {
      console.error("Error fetching reports:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reports. Please try again.",
        variant: "destructive",
      });
    } else if (data) {
      setReports(data);
    }
    setIsLoading(false);
  };

  // -------------------------
  // REALTIME SUBSCRIPTION
  // -------------------------
  useEffect(() => {
    fetchReports();

    const reportsSubscription = supabase
      .channel("ngo-reports-page") // Use a unique channel name for the page
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, (payload) => {
        console.log("Change received on page!", payload);
        fetchReports();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(reportsSubscription);
    };
  }, []);

  // -------------------------
  // MARK REPORT AS COMPLETED
  // -------------------------
  const markAsCompleted = async (reportId: string) => {
    const reportToUpdate = reports.find((r) => r.id === reportId);
    if (!reportToUpdate) return;

    if (reportToUpdate?.status === "completed") {
      toast({
        title: "Info",
        description: "Report is already marked as completed.",
      });
      return;
    }

    const { error } = await supabase
      .from("reports")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", reportId);

    if (error) {
      console.error("Error updating report:", error);
      toast({
        title: "Error",
        description: "Failed to update report status. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Report marked as completed.",
      });
    }
  };

  // -------------------------
  // UI RENDER
  // -------------------------
  return (
    <div className="min-h-screen bg-background section-padding">
      <Navigation />
      <div className="container max-w-7xl mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
          NGO Dashboard - Incoming Reports
        </h1>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading reports...</p>
        ) : (
          <div className="rounded-md border bg-card overflow-hidden mb-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Photo</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[180px] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                          {/* Ensure report.photo is a valid URL */}
                          {report.photo && (
                             <img
                               src={report.photo}
                               alt={report.description || "Report image"}
                               className="w-full h-full object-cover"
                               onError={(e) => {
                                 console.warn(`Failed to load image: ${report.photo}`);
                                 (e.currentTarget.style.display = "none");
                                 // Optionally display a placeholder icon/text in the div
                               }}
                             />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px] align-top"> {/* Use align-top */}
                        <div className="truncate font-medium"> {/* Truncate location */}
                           {report.location || "No Location Provided"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Reported: {new Date(report.created_at).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px] align-top truncate"> {/* Use align-top and truncate */}
                        {report.description || "No Description Provided"}
                      </TableCell>
                      <TableCell className="align-top"> {/* Use align-top */}
                        <Badge
                          variant={report.status === "completed" ? "default" : "secondary"}
                          className={
                            report.status === "completed"
                              ? "bg-green-500/80 text-white"
                              : "bg-yellow-500/80 text-white"
                          }
                        >
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right align-top"> {/* Use align-top */}
                        {report.status !== "completed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsCompleted(report.id)}
                          >
                            Mark as Completed
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* --- Metrics Section --- */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium">
                Total Reports Received
              </CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234</div>
              <p className="text-sm text-muted-foreground">
                +52 since last week
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <Clock className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">247</div>
              <p className="text-sm text-muted-foreground">
                Avg. response time: 2 days
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium">Reports Completed</CardTitle>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">987</div>
              <p className="text-sm text-muted-foreground">
                80% completion rate
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium">Waste Collected</CardTitle>
              <Trash2 className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4,500 kg</div>
              <p className="text-sm text-muted-foreground">
                Based on completed reports
              </p>
            </CardContent>
          </Card>
          {/* Additional Cards */}
          <Card className="glass-card p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium">Top Locations</CardTitle>
              <MapPinIcon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between"><span>Downtown Area</span> <Badge variant="secondary">15 reports</Badge></li>
                <li className="flex justify-between"><span>North Park</span> <Badge variant="secondary">11 reports</Badge></li>
                <li className="flex justify-between"><span>Riverside</span> <Badge variant="secondary">8 reports</Badge></li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Focus areas based on report density
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
              <BarChartHorizontal className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">+15%</div>
              <p className="text-sm text-muted-foreground">
                Increase compared to previous month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* --- Report Analysis Section --- */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">Report Analysis</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1: Report Volume Over Time (Placeholder) */}
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Report Trend (Last 30 Days)</CardTitle>
                <BarChartHorizontal className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+15%</div>
                <p className="text-xs text-muted-foreground">
                  Increase compared to previous month
                </p>
                {/* Placeholder for a small chart */}
                <div className="h-20 mt-4 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
                  [Chart Placeholder]
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Hotspot Locations (Placeholder) */}
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Report Locations</CardTitle>
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                 <ul className="space-y-1 text-sm">
                    <li className="flex justify-between"><span>Downtown Area</span> <Badge variant="secondary">15 reports</Badge></li>
                    <li className="flex justify-between"><span>North Park</span> <Badge variant="secondary">11 reports</Badge></li>
                    <li className="flex justify-between"><span>Riverside</span> <Badge variant="secondary">8 reports</Badge></li>
                 </ul>
                 <p className="text-xs text-muted-foreground mt-2">
                   Focus areas based on report density
                 </p>
              </CardContent>
            </Card>

            {/* Card 3: Completion Rate (Placeholder) */}
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82%</div>
                <p className="text-xs text-muted-foreground">
                  Of reports marked as completed
                </p>
                 {/* Placeholder for progress or gauge */}
                 <div className="h-2 mt-4 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '82%' }}></div>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* --- End Report Analysis Section --- */}

      </div>
    </div>
  );
};

export default NgoDashboardPage; // Ensure the export matches the component name
