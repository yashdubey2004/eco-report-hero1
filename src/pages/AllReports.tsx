import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AllReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchAllReports = async () => {
      const { data, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
      if (!error) setReports(data);
    };
    fetchAllReports();
  }, []);

  return (
    <div className="min-h-screen bg-background section-padding">
      <div className="container max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">All Reports</h1>
        <div className="rounded-md border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                      <img src={report.photo} alt="Report" className="w-full h-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>{report.location || "No Location Provided"}</TableCell>
                  <TableCell>{report.description || "No Description Provided"}</TableCell>
                  <TableCell>{report.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AllReports;
