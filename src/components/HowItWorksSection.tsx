import React, { useState, useEffect } from "react";
import { CheckCircle, Upload, Search, UserCheck } from "lucide-react";
import supabase from "../supabaseClient"; // adjust path if needed

const steps = [
  {
    icon: Upload,
    title: "Upload Photo",
    description: "Take or upload a photo of waste in your area.",
  },
  {
    icon: Search,
    title: "AI Classification",
    description: "Our AI identifies the type of waste and recyclability.",
  },
  {
    icon: UserCheck,
    title: "NGO Matching",
    description: "Get connected with local NGOs who can collect the waste.",
  },
  {
    icon: CheckCircle,
    title: "Track Progress",
    description: "Monitor the status of your reports and cleanups.",
  },
];

const HowItWorksSection = () => {
  const [reportCount, setReportCount] = useState(0);
  const [ngoPartners, setNgoPartners] = useState(0);
  const [aiAccuracy, setAiAccuracy] = useState(0);

  // Function to fetch report count
  const fetchReportCount = async () => {
    const { count, error } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true });
    if (!error && count !== null) {
      setReportCount(count);
    }
  };

  useEffect(() => {
    fetchReportCount();
    const reportChannel = supabase
      .channel("realtime:reportsCount")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reports" },
        () => {
          fetchReportCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reportChannel);
    };
  }, []);

  // Function to fetch global stats
  const fetchGlobalStats = async () => {
    const { data, error } = await supabase
      .from("stats")
      .select("*")
      .eq("id", "globalStats")
      .single();
    if (!error && data) {
      setNgoPartners(data.ngoPartners || 0);
      setAiAccuracy(data.aiAccuracy || 0);
    }
  };

  useEffect(() => {
    fetchGlobalStats();
    const statsChannel = supabase
      .channel("realtime:globalStats")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stats", filter: "id=eq.globalStats" },
        () => {
          fetchGlobalStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(statsChannel);
    };
  }, []);

  return (
    <section id="how-it-works" className="section-padding">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="text-muted-foreground">
            Our platform uses AI to connect citizens with NGOs for efficient waste management and recycling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="glass-card p-6 relative group">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>

              <div className="mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <step.icon className="h-7 w-7 text-primary" />
              </div>

              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>

              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-6 glass-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gradient">{reportCount.toLocaleString()}+</div>
              <p className="text-muted-foreground">Waste Reports</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gradient">{ngoPartners.toLocaleString()}+</div>
              <p className="text-muted-foreground">NGO Partners</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gradient">{aiAccuracy}%</div>
              <p className="text-muted-foreground">AI Accuracy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
