
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ReportSection from "@/components/ReportSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import NGOPartnersSection from "@/components/NGOPartnersSection";
import DashboardPreviewSection from "@/components/DashboardPreviewSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ReportSection />
      <HowItWorksSection />
      <NGOPartnersSection />
      <DashboardPreviewSection />
      <FooterSection />
    </div>
  );
};

export default Index;
