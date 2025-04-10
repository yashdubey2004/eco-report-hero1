// D:\eco-report-hero\src\context\AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import supabase from "../supabaseClient";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  role: string;
  login: (email: string, password: string) => Promise<string>; // returns the user role
  signup: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>("user");

  // Fetch the role from the profiles table
  const fetchRole = async (userId: string) => {
    console.log(`Fetching role for userId: ${userId}`); // Add logging
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    console.log("Profile data fetched:", profile); // Add logging
    console.log("Profile fetch error:", error); // Add logging

    if (error) {
      console.error("Error fetching profile:", error);
      setRole("user"); // Default to user on error
      return "user";
    } else {
      const fetchedRole = profile?.role; // Get the role before normalization
      console.log("Raw role from DB:", fetchedRole); // Add logging
      const normalized = fetchedRole?.toLowerCase() || "user";
      console.log("Normalized role:", normalized); // Add logging
      setRole(normalized);
      return normalized;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchRole(session.user.id);
      } else {
        setUser(null);
        setRole("user");
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchRole(session.user.id);
        } else {
          setUser(null);
          setRole("user");
        }
      }
    );
    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<string> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw error || new Error("Login failed");
    setUser(data.user);
    // Fetch and return the role
    const newRole = await fetchRole(data.user.id);
    return newRole;
  };

  const signup = async (email: string, password: string, newRole: string = "user") => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      console.error("Supabase signup error:", error); // Log the specific error
      throw new Error(error?.message || "Signup failed. Please check email or password requirements.");
    }
    console.log(`Signup successful for ${email}, attempting to set role to ${newRole} for user ID: ${data.user.id}`); // Add logging

    // Upsert into profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        [
          {
            id: data.user.id,
            role: newRole, // Use the passed newRole
            email: data.user.email, // Store email for potential future use
          },
        ],
        { onConflict: "id" } // Use 'id' as the conflict target
      );

    // Add logging for profile upsert result
    if (profileError) {
      console.error(`Failed to create/update profile for ${data.user.id}:`, profileError);
      // Decide if you want to throw an error here or just log it
      // Throwing might be better to indicate the signup wasn't fully complete
      throw new Error(`Account created, but failed to set role: ${profileError.message}`);
    } else {
      console.log(`Successfully created/updated profile for ${data.user.id} with role ${newRole}`);
    }

    // Set state immediately based on signup info, though login flow will re-fetch
    setUser(data.user);
    setRole(newRole.toLowerCase());
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setRole("user");
  };

  return (
    <AuthContext.Provider value={{ user, role, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth requires AuthProvider");
  return context;
};
