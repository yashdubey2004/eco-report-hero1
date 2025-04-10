import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, MapPin, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import supabase from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const ReportSection = () => {
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // -------------------------
  // HANDLE IMAGE CHANGE
  // -------------------------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Show a preview in the UI
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result as string);
        setUploadProgress(0);
      };
      reader.readAsDataURL(file);
    }
  };

  // -------------------------
  // UPLOAD IMAGE TO SUPABASE
  // -------------------------
  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploadProgress(30);
      // Construct a unique file name
      const fileName = `${user?.id || "anon"}/${Date.now()}-${file.name}`;

      // Attempt to upload to Supabase Storage (bucket "reports")
      const { error: uploadError } = await supabase.storage
        .from("reports")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;
      setUploadProgress(70);

      // Retrieve the public URL for this image
      const { data } = supabase.storage.from("reports").getPublicUrl(fileName);
      if (!data?.publicUrl) {
        throw new Error("Could not get public URL for uploaded image.");
      }

      setUploadProgress(100);
      return data.publicUrl;
    } catch (err: any) {
      console.error("Upload failed:", err);
      setUploadProgress(0);
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // -------------------------
  // HANDLE USER LOCATION
  // -------------------------
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setIsFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
              {
                headers: {
                  "Accept-Language": "en",
                  "User-Agent": "EcoLinkApp/1.0 (your-email@example.com)",
                },
              }
            );

            if (!response.ok) {
              throw new Error(`Geocoding failed: ${response.statusText}`);
            }

            const data = await response.json();
            setLocation(
              data.display_name ||
                `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`
            );
          } catch (error: any) {
            console.error("Location fetch error:", error);
            // Fallback to raw coords if we can’t fetch address
            setLocation(
              `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`
            );
            toast({
              title: "Location Error",
              description:
                error.message || "Could not fetch address. Using coordinates.",
              variant: "default",
            });
          } finally {
            setIsFetchingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsFetchingLocation(false);
          toast({
            title: "Location Error",
            description:
              "Could not get location. Please enable permissions or enter manually.",
            variant: "destructive",
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
    }
  };

  // -------------------------
  // HANDLE FORM SUBMISSION
  // -------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure user is logged in
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in or sign up to submit a report.",
        variant: "destructive",
      });
      return;
    }

    // Validate image
    if (!imageFile) {
      toast({
        title: "Missing Image",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    // Validate location
    if (!location) {
      toast({
        title: "Missing Location",
        description: "Please provide the location of the waste.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload image to Supabase Storage, get public URL
      const imageUrl = await uploadImage(imageFile);

      // Insert a new record in "reports" with status = "pending"
      const { error: insertError } = await supabase.from("reports").insert([
        {
          user_id: user.id,
          photo: imageUrl,
          location,
          description,
          status: "pending",
        },
      ]);

      if (insertError) throw insertError;

      // Clear local form state
      setPreviewPhoto(null);
      setImageFile(null);
      setLocation("");
      setDescription("");
      setUploadProgress(0);

      toast({
        title: "Success!",
        description:
          "Report submitted successfully. Thank you for your contribution!",
      });
    } catch (err: any) {
      console.error("Submission failed:", err);
      toast({
        title: "Submission Failed",
        description: err.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------
  // UI RENDER
  // -------------------------
  return (
    <section id="report" className="section-padding bg-muted/20">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Report Waste</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See waste? Snap a photo, add details, and help us coordinate cleanup
            efforts with local NGOs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Submit a Report</CardTitle>
              <CardDescription>Help us keep the environment clean.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Provide details about the waste or issue you want to report.
              </p>
              <Button
                className="mt-4 w-full bg-primary hover:bg-primary/90"
                onClick={() => window.location.href = "#report"}
              >
                Submit Now
              </Button>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Track Your Reports</CardTitle>
              <CardDescription>Monitor the status of your submissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Stay updated on the progress of your reports.
              </p>
              <Button
                className="mt-4 w-full bg-primary hover:bg-primary/90"
                onClick={() => window.location.href = "/dashboard-preview"}
              >
                View Reports
              </Button>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Impact Metrics</CardTitle>
              <CardDescription>See how your reports contribute to change.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track the collective impact of all reports submitted.
              </p>
              <Button
                className="mt-4 w-full bg-primary hover:bg-primary/90"
                onClick={() => window.location.href = "/dashboard-preview"}
              >
                View Impact
              </Button>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-6">
          {/* --------------- PHOTO UPLOAD --------------- */}
          <div className="space-y-2">
            <label htmlFor="photo-upload" className="block text-sm font-medium text-foreground">
              Upload Photo*
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-48 h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/50 text-muted-foreground overflow-hidden">
                {previewPhoto ? (
                  <img src={previewPhoto} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <Camera className="h-10 w-10" />
                )}
              </div>
              <div className="flex-1 w-full">
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a clear photo of the waste.
                </p>
                {uploadProgress > 0 && (
                  <Progress value={uploadProgress} className="w-full h-2 mt-2" />
                )}
              </div>
            </div>
          </div>

          {/* --------------- LOCATION --------------- */}
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-foreground">
              Location*
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Input
                id="location"
                type="text"
                placeholder="e.g., Near Central Park entrance"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleLocationClick}
                disabled={isFetchingLocation}
                className="w-full sm:w-auto"
              >
                {isFetchingLocation ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="mr-2 h-4 w-4" />
                )}
                Use Current Location
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Enter the address or use your current location.
            </p>
          </div>

          {/* --------------- DESCRIPTION --------------- */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-foreground">
              Description (Optional)
            </label>
            <Textarea
              id="description"
              placeholder="Add any relevant details (e.g., type of waste, approximate amount, accessibility)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              More details help NGOs respond effectively.
            </p>
          </div>

          {/* --------------- SUBMIT --------------- */}
          <Button type="submit" disabled={isSubmitting || !user} className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>

          {/* --------------- AUTH NOTICE --------------- */}
          {!user && (
            <p className="text-sm text-yellow-600 dark:text-yellow-500 text-center mt-2">
              Please{" "}
              <Link to="/login" className="underline hover:text-primary">
                Login
              </Link>{" "}
              or{" "}
              <Link to="/signup" className="underline hover:text-primary">
                Sign Up
              </Link>{" "}
              to submit a report.
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default ReportSection;
