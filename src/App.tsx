// D:\eco-report-hero\src\App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NgoDashboard from "./pages/NgoDashboard";  // Now in pages folder
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* NGO Routes */}
        <Route element={<ProtectedRoute requiredRole="ngo" />}>
          <Route path="/NgoDashboard" element={<NgoDashboard />} />
        </Route>

        {/* Regular User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Index />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
