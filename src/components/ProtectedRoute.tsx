// D:\eco-report-hero\src\components\ProtectedRoute.tsx
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }: { requiredRole?: string }) => {
  const { user, role } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) {
    console.warn("User role does not match required role.  user role:", role, " requiredRole:", requiredRole);
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
