// D:\eco-report-hero\src\pages/NgoDashboard.tsx
import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Navigation from "../components/Navigation";

const NgoDashboard = () => {
  const [metrics, setMetrics] = useState({
    weeklyPickups: [12, 15, 8, 20, 18, 22, 17],
    responseTimes: [48, 24, 36, 12, 60, 30, 45],
    wasteTypes: { plastic: 45, metal: 25, glass: 15, ewaste: 10, organic: 5 },
  });

  const chartData = [
    { name: "Mon", pickups: 12 },
    { name: "Tue", pickups: 15 },
    { name: "Wed", pickups: 8 },
    { name: "Thu", pickups: 20 },
    { name: "Fri", pickups: 18 },
    { name: "Sat", pickups: 22 },
    { name: "Sun", pickups: 17 },
  ];

  const fetchMetrics = async () => {
    const { data, error } = await supabase
      .from("ngo_metrics")
      .select("*")
      .single();

    if (error) {
      console.error("Metrics fetch error:", error);
      return;
    }

    if (data) {
      setMetrics({
        weeklyPickups: data.weekly_pickups || [],
        responseTimes: data.response_times || [],
        wasteTypes: data.waste_types || {},
      });
    }
  };

  useEffect(() => {
    fetchMetrics();
    const metricsChannel = supabase
      .channel("ngo-metrics")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ngo_metrics" },
        () => fetchMetrics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(metricsChannel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background section-padding">
      <Navigation />

      <div className="container max-w-7xl mx-auto pt-8">
        <h1 className="text-3xl font-bold mb-8">NGO Analytics Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Weekly Pickups</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pickups" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Waste Composition</h3>
            <div className="space-y-2">
              {Object.entries(metrics.wasteTypes).map(([type, value]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="capitalize">{type}</span>
                  <div className="w-1/2 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                <p className="text-2xl font-bold">2.4h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Collected</p>
                <p className="text-2xl font-bold">1,240kg</p>
              </div>
            </div>
          </div>
        </div>
        {/* You can add more components or lists here */}
      </div>
    </div>
  );
};

export default NgoDashboard;
