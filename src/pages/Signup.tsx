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
    try {
      await signup(email, password, role);
      navigate("/login");
    } catch (err: any) {
      setError(
        err.message.includes("exists") ? "Email already exists" : "Signup failed"
      );
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
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="user"
                checked={role === "user"}
                onChange={() => setRole("user")}
              />
              Citizen
            </label>
            <label className="flex items-center gap-2">
            <input
              type="radio"
                value="ngo"
                checked={role === "ngo"}
                onChange={() => setRole("ngo")}
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
