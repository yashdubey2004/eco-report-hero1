
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-lg py-3 shadow-lg shadow-black/10" : "bg-transparent py-5"
      )}
    >
      <div className="container max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full eco-gradient flex items-center justify-center">
            <span className="text-white font-bold">E</span>
          </div>
          <span className="font-bold text-lg">EcoReportHero</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-sm text-foreground hover:text-primary transition-colors">Home</a>
          <a href="#report" className="text-sm text-foreground hover:text-primary transition-colors">Report</a>
          <a href="#how-it-works" className="text-sm text-foreground hover:text-primary transition-colors">How It Works</a>
          <a href="#ngo-partners" className="text-sm text-foreground hover:text-primary transition-colors">NGO Partners</a>
          <a href="#dashboard" className="text-sm text-foreground hover:text-primary transition-colors">Dashboard</a>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="text-sm">Login</Button>
          <Button className="text-sm bg-primary hover:bg-primary/90">Sign Up</Button>
        </div>
        
        {/* Mobile Navigation Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border animate-fade-in">
          <div className="container py-4 flex flex-col gap-4">
            <a href="#home" className="px-4 py-2 hover:bg-muted rounded-md transition-colors">Home</a>
            <a href="#report" className="px-4 py-2 hover:bg-muted rounded-md transition-colors">Report</a>
            <a href="#how-it-works" className="px-4 py-2 hover:bg-muted rounded-md transition-colors">How It Works</a>
            <a href="#ngo-partners" className="px-4 py-2 hover:bg-muted rounded-md transition-colors">NGO Partners</a>
            <a href="#dashboard" className="px-4 py-2 hover:bg-muted rounded-md transition-colors">Dashboard</a>
            
            <div className="flex gap-2 mt-2 px-4">
              <Button variant="outline" className="flex-1">Login</Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90">Sign Up</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
