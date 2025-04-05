
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, MapPin, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReportSection = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          // Create preview URL
          const reader = new FileReader();
          reader.onload = () => {
            setPreviewImage(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      }, 100);
    }
  };

  return (
    <section id="report" className="min-h-screen section-padding flex items-center">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Report Waste in Your Area
          </h2>
          <p className="text-muted-foreground">
            Upload a photo of waste or garbage, and our AI will classify it while
            connecting you with nearby NGOs for proper disposal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="glass-card p-6 order-2 lg:order-1">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="upload">Upload Photo</TabsTrigger>
                <TabsTrigger value="camera">Take Photo</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-all
                    ${previewImage ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                >
                  {previewImage ? (
                    <div className="w-full aspect-square max-h-[300px] overflow-hidden rounded-lg">
                      <img
                        src={previewImage}
                        alt="Uploaded waste"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium">Drag and drop image here</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          or click to browse from your device
                        </p>
                      </div>
                    </>
                  )}
                  
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="upload-input"
                  />
                  <label htmlFor="upload-input">
                    <Button type="button" className="mt-4">
                      {previewImage ? "Change Image" : "Upload Image"}
                    </Button>
                  </label>
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter location or use current location" 
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description (optional)</label>
                    <textarea 
                      className="w-full rounded-md bg-transparent border border-input px-3 py-2 text-sm ring-offset-background"
                      placeholder="Add details about the waste or location"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Submit Report
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="camera" className="space-y-6">
                <div className="border-2 border-dashed border-muted rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium">Open camera to take a photo</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Make sure the waste is clearly visible
                    </p>
                  </div>
                  <Button type="button" className="mt-4">
                    Open Camera
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter location or use current location" 
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description (optional)</label>
                    <textarea 
                      className="w-full rounded-md bg-transparent border border-input px-3 py-2 text-sm ring-offset-background"
                      placeholder="Add details about the waste or location"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full bg-primary hover:bg-primary/90" disabled>
                    Take Photo & Submit
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="order-1 lg:order-2">
            <div className="glass-card p-6 overflow-hidden">
              <h3 className="text-xl font-semibold mb-4">AI Waste Classification</h3>
              
              <div className="space-y-6">
                {/* Placeholder for AI prediction results */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Upload an image to start</span>
                    <span className="text-xs text-muted-foreground">AI powered by TensorFlow.js</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 mb-8">
                    {["Plastic", "Metal", "Glass", "E-Waste", "Organic"].map((type) => (
                      <div key={type} className="text-center p-2 rounded-md bg-muted">
                        <p className="text-xs font-medium truncate">{type}</p>
                        <div className="h-1 mt-2 bg-muted-foreground/20 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-medium mb-3">Nearby NGOs that can help</h4>
                  <div className="space-y-2 opacity-60">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="font-medium">Upload an image to find NGOs</p>
                      <p className="text-xs text-muted-foreground">We'll match you with organizations in your area</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium">Recent Reports Near You</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Array(3).fill(0).map((_, i) => (
                      <div 
                        key={i}
                        className="aspect-square rounded-md bg-muted overflow-hidden opacity-60"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportSection;
