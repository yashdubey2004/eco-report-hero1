import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ngoPartners = [
  {
    name: "Swacch Association, Nagpur",
    logo: "https://via.placeholder.com/200", // Replace with a real logo if available
    description: "A trusted organization dedicated to waste management in Nagpur.",
    location: "Nagpur, India",
    specialties: ["Waste Management"],
    viewProfileLink: "https://swacchnagpur.org/",
    contactPhone: "+91 98504 89953",
    contactEmail: "swacchnagpur@gmail.com"
  },
  {
    name: "Arranya Environment Organization",
    logo: "https://via.placeholder.com/200",
    description: "Committed to sustainable environment practices and recycling.",
    location: "Location not provided",
    specialties: ["Recycling", "Environment"],
    viewProfileLink: "https://arranya.org/",
    contactPhone: "9503525939",
    contactEmail: "arranya@ymail.com"
  },
  {
    name: "Agresar Foundation",
    logo: "https://via.placeholder.com/200",
    description: "Fostering community initiatives for environmental sustainability.",
    location: "Location not provided",
    specialties: ["Community", "Sustainability"],
    viewProfileLink: "https://www.instagram.com/agresarfoundation/",
    contactPhone: "09960244888",
    contactEmail: "agresar.foundation@gmail.com"
  },
  {
    name: "Garaj Foundation",
    logo: "https://via.placeholder.com/200",
    description: "Working to improve waste management and create cleaner communities.",
    location: "Location not provided",
    specialties: ["Waste Management"],
    viewProfileLink: "https://garajfoundation.org/",
    contactPhone: "+91-9175463603",
    contactEmail: "garajfoundation@gmail.com"
  }
];

const NGOPartnersSection = () => {
  return (
    <section id="ngo-partners" className="section-padding bg-muted/20">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">NGO Partners</h2>
          <p className="text-muted-foreground">
            We collaborate with these trusted organizations to ensure proper waste disposal and recycling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ngoPartners.map((ngo, index) => (
            <Card
              key={index}
              className="glass-card border-0 overflow-hidden group hover:shadow-xl transition-all"
            >
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
                <CardDescription className="mb-4">
                  {ngo.description}
                </CardDescription>

                <div className="flex flex-wrap gap-2 mb-4">
                  {ngo.specialties.map((specialty, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-primary/10 border-primary/20 text-primary"
                    >
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
                  <a
                    href={ngo.viewProfileLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="w-full transition-colors"
                    >
                      View Profile
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </a>
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
