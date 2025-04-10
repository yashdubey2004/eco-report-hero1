// D:\eco-report-hero\src\pages/Signup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      await signup(email, password, role);
      // Signup successful, now navigate based on the role selected in the form
      console.log(`Signup successful for role: ${role}. Navigating...`);
      if (role === "ngo") {
        navigate("/NgoDashboard");
      } else {
        navigate("/"); // Navigate regular users to the main page
      }
      // Optionally, show a success toast/message here
    } catch (err: any) {
      console.error("Signup component error:", err); // Log the error for debugging
      if (err?.message?.includes("User already registered")) {
        setError("This email address is already registered. Please try logging in.");
      } else {
        setError(err?.message || "Signup failed. Please check your details and try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md glass-card p-6 rounded-2xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSignup}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex gap-4 justify-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="user"
                checked={role === "user"}
                onChange={() => setRole("user")}
                className="cursor-pointer"
              />
              Citizen
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="ngo"
                checked={role === "ngo"}
                onChange={() => setRole("ngo")}
                className="cursor-pointer"
              />
              NGO
            </label>
          </div>
          <Button className="w-full" type="submit">
            Sign Up
          </Button>
        </form>
        <p className="text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
