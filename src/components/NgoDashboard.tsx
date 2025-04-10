import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { Button } from "@/components/ui/button";
import Navigation from "../components/Navigation";
import { toast } from "@/hooks/use-toast";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components
import { Package, CheckCircle2, Clock, Trash2 } from "lucide-react"; // Import icons

const NgoDashboard = () => {
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
      .channel("ngo-reports")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, (payload) => {
        console.log("Change received!", payload);
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
          NGO Dashboard
        </h1>

        {/* --- Metrics Section --- */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reports Received
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +52 since last week
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reports Completed
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">987</div>
              <p className="text-xs text-muted-foreground">
                80% completion rate
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">
                Avg. response time: 2 days
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Est. Waste Collected
              </CardTitle>
              <Trash2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4,500 kg</div>
              <p className="text-xs text-muted-foreground">
                Based on completed reports
              </p>
            </CardContent>
          </Card>
        </div>
        {/* --- End Metrics Section --- */}

        <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">Incoming Reports</h2>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading reports...</p>
        ) : (
          <div className="rounded-md border bg-card overflow-hidden">
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
                          <img
                            src={report.photo}
                            alt={report.description || "Report image"}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {report.location || "No Location Provided"}
                        <div className="text-xs text-muted-foreground mt-1">
                          Reported: {new Date(report.created_at).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {report.description || "No Description Provided"}
                      </TableCell>
                      <TableCell>
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
                      <TableCell className="text-right">
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
      </div>
    </div>
  );
};

export default NgoDashboard;
