import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const FooterSection = () => {
  return (
    <footer className="bg-muted/30 pt-16 pb-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full eco-gradient flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="font-bold text-lg">EcoReportHero</span>
            </div>
            <p className="text-muted-foreground mb-4 text-sm">
              Connecting citizens with NGOs to clean up our planet, one report at a time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="text-muted-foreground hover:text-primary">Home</a></li>
              <li><a href="#report" className="text-muted-foreground hover:text-primary">Report Waste</a></li>
              <li><a href="#how-it-works" className="text-muted-foreground hover:text-primary">How It Works</a></li>
              <li><a href="#ngo-partners" className="text-muted-foreground hover:text-primary">NGO Partners</a></li>
              <li><a href="#dashboard" className="text-muted-foreground hover:text-primary">Dashboard</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">NGO Registration</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>dubeyys@rknec.edu</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>7020014909</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Boys Hostel, RBU, Nagpur</span>
              </li>
              {/* Your Details */}
              <li className="flex flex-col text-muted-foreground">
                
                <span></span>
                <span></span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} EcoLink. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="link" className="text-sm p-0 h-auto text-muted-foreground hover:text-primary">
              Privacy Policy
            </Button>
            <Button variant="link" className="text-sm p-0 h-auto text-muted-foreground hover:text-primary">
              Terms of Service
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
