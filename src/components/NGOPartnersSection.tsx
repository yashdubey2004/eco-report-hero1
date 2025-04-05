
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ngoPartners = [
  {
    name: "EcoRecycle Foundation",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop&crop=entropy&q=80",
    description: "Specializing in plastic and e-waste recycling in urban areas.",
    location: "San Francisco, CA",
    specialties: ["Plastic", "E-Waste"],
    contactPhone: "+1 (555) 123-4567",
    contactEmail: "info@ecorecycle.org"
  },
  {
    name: "GreenEarth Collective",
    logo: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=200&h=200&fit=crop&crop=entropy&q=80",
    description: "Community-based organization focusing on organic waste composting.",
    location: "Portland, OR",
    specialties: ["Organic", "Paper"],
    contactPhone: "+1 (555) 234-5678",
    contactEmail: "contact@greenearthcollective.org"
  },
  {
    name: "CleanOcean Initiative",
    logo: "https://images.unsplash.com/photo-1497290756760-23ac55edf36f?w=200&h=200&fit=crop&crop=entropy&q=80",
    description: "Dedicated to collecting and recycling waste from coastal areas.",
    location: "Seattle, WA",
    specialties: ["Plastic", "Metal", "Glass"],
    contactPhone: "+1 (555) 345-6789",
    contactEmail: "help@cleanocean.org"
  },
  {
    name: "TechReclaim",
    logo: "https://images.unsplash.com/photo-1618004652321-13a63e576b80?w=200&h=200&fit=crop&crop=entropy&q=80", 
    description: "Specializing in electronic waste recycling and refurbishment.",
    location: "Austin, TX",
    specialties: ["E-Waste", "Metal"],
    contactPhone: "+1 (555) 456-7890",
    contactEmail: "contact@techreclaim.org"
  }
];

const NGOPartnersSection = () => {
  return (
    <section id="ngo-partners" className="section-padding bg-muted/20">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">NGO Partners</h2>
          <p className="text-muted-foreground">
            We collaborate with these trusted organizations to ensure proper waste disposal and recycling
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ngoPartners.map((ngo, index) => (
            <Card key={index} className="glass-card border-0 overflow-hidden group hover:shadow-xl transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <img src={ngo.logo} alt={ngo.name} className="object-cover" />
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{ngo.name}</CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{ngo.location}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <CardDescription className="mb-4">{ngo.description}</CardDescription>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {ngo.specialties.map((specialty, i) => (
                    <Badge key={i} variant="outline" className="bg-primary/10 border-primary/20 text-primary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{ngo.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{ngo.contactEmail}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-colors">
                    View Profile
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="link" className="text-primary">
            View All Partners
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NGOPartnersSection;
