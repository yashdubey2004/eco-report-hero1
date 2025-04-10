export interface Report {
  id: string; // Assuming UUID from Supabase
  created_at: string; // ISO 8601 timestamp string
  updated_at?: string; // ISO 8601 timestamp string, optional
  photo: string; // URL to the image
  location: string;
  description?: string; // Optional description
  status: "Pending" | "completed" | "rejected"; // Possible statuses
  user_id: string; // Assuming UUID of the user who submitted
  plastic_percent?: number;
  metal_percent?: number;
  glass_percent?: number;
  ewaste_percent?: number;
  organic_percent?: number;
  // Add any other fields from your 'reports' table schema if needed
}

// You can add other table types here as needed
// export interface User { ... }
// export interface Ngo { ... }
