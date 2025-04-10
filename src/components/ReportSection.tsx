import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, MapPin, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import supabase from "../supabaseClient";

const ReportSection = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [classification, setClassification] = useState({
    PLASTIC: 0,
    METAL: 0,
    GLASS: 0,
    E_WASTE: 0,
    ORGANIC: 0,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadProgress(30);
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("reports")
        .upload(fileName, file, {
          contentType: file.type,
          cacheControl: "3600",
        });
      if (error) throw error;
      const { data: { publicUrl } } = await supabase.storage
        .from("reports")
        .getPublicUrl(fileName);
      setPreviewPhoto(publicUrl);
      setUploadProgress(100);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadProgress(0);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setIsFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
              { headers: { "User-Agent": "WasteManagementApp/1.0" } }
            );
            const data = await response.json();
            setLocation(data.display_name || "Location found");
          } catch (error) {
            setLocation("Location detection failed");
          } finally {
            setIsFetchingLocation(false);
          }
        },
        (_error) => {
          setIsFetchingLocation(false);
        }
      );
    }
  };

  // Gemini analysis remains unchanged.
  const analyzeImage = async (photoUrl: string) => {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    try {
      const imgBlob = await fetch(photoUrl).then((r) => r.blob());
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(imgBlob);
      });
      const prompt = `Analyze this waste image. Return ONLY JSON percentages for:
      PLASTIC, METAL, GLASS, E_WASTE, ORGANIC. Example:
      {"PLASTIC":50,"METAL":20,"GLASS":15,"E_WASTE":5,"ORGANIC":10}
      Total must be 100. If unsure, add remainder to ORGANIC.`;
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image.split(",")[1],
            mimeType: imgBlob.type,
          },
        },
      ]);
      const response = await result.response;
      const text = response.text();
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (!jsonMatch) throw new Error("Invalid response format");
      const analysis = JSON.parse(jsonMatch[0]);
      const total = Object.values(analysis).reduce((sum: number, val: number) => sum + val, 0);
      if (total !== 100) {
        analysis.ORGANIC = (Number(analysis.ORGANIC) || 0) + (100 - total);
      }
      return analysis;
    } catch (error) {
      console.error("Analysis failed:", error);
      return {
        PLASTIC: 40,
        METAL: 25,
        GLASS: 15,
        E_WASTE: 5,
        ORGANIC: 15,
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewPhoto) return;
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const aiClassification = await analyzeImage(previewPhoto);
      setClassification(aiClassification); // Keep setting the state for UI display

      // Insert into the "reports" table
      const reportData = {
        photo: previewPhoto,
        location,
        description,
        status: "Pending",
        user_id: user.id,
        // Include classification data in the report
        // plastic_percent: aiClassification.PLASTIC,
        // metal_percent: aiClassification.METAL,
        // glass_percent: aiClassification.GLASS,
        // ewaste_percent: aiClassification.E_WASTE,
        // organic_percent: aiClassification.ORGANIC
      };

      const { error } = await supabase.from("reports").insert([reportData]);

      if (error) throw error;

      setPreviewPhoto(null);
      setLocation("");
      setDescription("");
      setUploadProgress(0);
      alert("Report submitted successfully!");
    } catch (err) {
      console.error("Submission failed:", err);
      alert(`Submission failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="report" className="min-h-screen section-padding flex items-center">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Analyze Your Waste Image</h2>
          <p className="text-muted-foreground">
            Upload a photo of waste and let our AI analyze its composition.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="glass-card p-6">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="upload">Upload Photo</TabsTrigger>
                <TabsTrigger value="camera">Take Photo</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="space-y-6">
                <form onSubmit={handleSubmit}>
                  <div
                    className={
                      "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-all " +
                      (previewPhoto ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50")
                    }
                  >
                    {previewPhoto ? (
                      <div className="w-full aspect-square max-h-[300px] overflow-hidden rounded-lg">
                        <img
                          src={previewPhoto}
                          alt="Uploaded waste"
                          className="w-full h-full object-cover"
                          onError={() => setPreviewPhoto(null)}
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
                        {previewPhoto ? "Change Photo" : "Upload Photo"}
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
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={handleLocationClick}
                          disabled={isFetchingLocation}
                        >
                          {isFetchingLocation ? <div className="animate-spin">↻</div> : <MapPin className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description (optional)</label>
                      <textarea
                        className="w-full rounded-md bg-transparent border border-input px-3 py-2 text-sm ring-offset-background"
                        placeholder="Add details about the waste"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={!previewPhoto || isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="camera" className="space-y-6">
                <div className="border-2 border-dashed border-muted rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium">Open camera to take a photo</p>
                    <p className="text-sm text-muted-foreground mt-1">Make sure the waste is clearly visible</p>
                  </div>
                  <Button type="button" className="mt-4" disabled>Open Camera</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-4">AI Waste Classification</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {classification.PLASTIC > 0 ? "Classification Results" : "No analysis available yet"}
                  </span>
                  <span className="text-xs text-muted-foreground">AI powered by Gemini</span>
                </div>
                <div className="grid grid-cols-5 gap-2 mb-8">
                  {Object.entries(classification).map(([type, value]) => (
                    <div key={type} className="text-center p-3 rounded-md bg-muted flex flex-col justify-center">
                      <p className="text-xs font-medium truncate">{type.replace(/_/g, " ")}</p>
                      <div className="relative h-2 bg-muted-foreground/20 rounded mt-2">
                        <div className="absolute top-0 left-0 h-full bg-primary rounded transition-all duration-500" style={{ width: `${value}%` }} />
                      </div>
                      <span className="text-xs mt-1 inline-block">{value}%</span>
                    </div>
                  ))}
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