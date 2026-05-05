import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useUser();
  
  if (loading) return <div>Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}