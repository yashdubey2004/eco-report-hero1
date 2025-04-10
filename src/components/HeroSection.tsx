import { Link as ScrollLink } from "react-scroll";
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom'



const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-0 w-80 h-80 bg-secondary/20 rounded-full blur-[150px]"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-center">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="space-y-2">
              <h2 className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                Environmental Waste Reporting
              </h2>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-gradient">Report. Recycle.</span><br />Reward.
              </h1>
            </div>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
              Help clean our planet by reporting waste. Our AI identifies recyclables and connects you with local NGOs for proper disposal.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <ScrollLink to="report" smooth={true} duration={600} offset={-70}>
              <Button className="bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition">
                Get Started
              </Button>
            </ScrollLink>

            <Button asChild>
          <a href="#how-it-works" className="scroll-smooth">
              Learn More
          </a>
            </Button>

            </div>
          </div>
          
          <div className="flex-1">
            <div className="relative p-2 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
              <div className="glass-card p-3 overflow-hidden">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Environmental reporting illustration" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 p-2 rounded-full eco-gradient">
                <div className="w-16 h-16 glass rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center">
          <a 
            href="#report" 
            className="text-muted-foreground hover:text-foreground transition-colors flex flex-col items-center gap-2"
          >
            <span className="text-sm">Scroll to Report</span>
            <div className="w-8 h-8 rounded-full border border-muted flex items-center justify-center">
              <ArrowDown className="h-4 w-4 animate-pulse-slow" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
