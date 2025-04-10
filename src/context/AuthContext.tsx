// D:\eco-report-hero\src\context\AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import supabase from "../supabaseClient";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  role: string;
  login: (email: string, password: string) => Promise<string>; // returns the new role
  signup: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>("user");

  // Helper to fetch the profile role
  const fetchRole = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    if (error) {
      console.error("Error fetching profile:", error);
      setRole("user");
      return "user";
    } else {
      const normalized = profile?.role?.toLowerCase() || "user";
      setRole(normalized);
      return normalized;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
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

  /**
   * login function that returns the new role as a string.
   */
  const login = async (email: string, password: string): Promise<string> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw error || new Error("Login failed");

    setUser(data.user);

    // fetch & normalize the role from the DB
    const newRole = await fetchRole(data.user.id);
    // Return the new role so the caller can navigate immediately
    return newRole;
  };

  const signup = async (email: string, password: string, newRole: string = "user") => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) throw error || new Error("Signup failed");

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        [
          {
            id: data.user.id,
            role: newRole,
            email: data.user.email,
          },
        ],
        { onConflict: "id" }
      );
    if (profileError) throw profileError;

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
