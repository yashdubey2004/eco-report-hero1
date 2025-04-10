import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { Button } from "@/components/ui/button";
import Navigation from "../components/Navigation";

const NgoDashboard = () => {
  const [reports, setReports] = useState<any[]>([]);

  // Fetch all reports from "reports" ordered by created_at descending.
  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("reports")
      .select("id, photo, location, description, status")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Reports fetch error:", error.message);
      return;
    }
    if (data) {
      setReports(data);
    }
  };

  useEffect(() => {
    fetchReports();
    // Subscribe to real-time updates on the "reports" table.
    const reportsChannel = supabase
      .channel("reports")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reports" },
        fetchReports
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reportsChannel);
    };
  }, []);

  const markAsCompleted = async (reportId: number) => {
    const { error } = await supabase
      .from("reports")
      .update({ status: "Completed" })
      .eq("id", reportId);
    if (error) {
      console.error("Mark as completed error:", error.message);
    } else {
      fetchReports();
    }
  };

  return (
    <div className="min-h-screen bg-background section-padding">
      <Navigation />
      <div className="container max-w-7xl mx-auto pt-8">
        <h1 className="text-3xl font-bold mb-8">NGO Analytics Dashboard</h1>
        {reports.length ? (
          reports.map((report) => (
            <div key={report.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 mb-2">
              <div className="w-24 h-16 rounded-md overflow-hidden">
                <img src={report.photo} alt={report.description || "Photo"} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium">{report.description || "No Description"}</h4>
                  <span className="bg-primary text-white text-xs rounded px-2 py-0.5">{report.status}</span>
                </div>
                <div className="text-xs text-muted-foreground">{report.location}</div>
              </div>
              {report.status !== "Completed" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => markAsCompleted(report.id)}
                  className="gap-1"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Mark as Completed
                </Button>
              )}
            </div>
          ))
        ) : (
          <p>No reports found.</p>
        )}
      </div>
    </div>
  );
};

export default NgoDashboard;
