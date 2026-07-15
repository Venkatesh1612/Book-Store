import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

// Wraps a route so only a logged-in user with the right role can view it.
export default function ProtectedRoute({ role, redirectTo = "/login", children }) {
  const { token, role: activeRole } = useAuth();
  if (!token || activeRole !== role) return <Navigate to={redirectTo} replace />;
  return children;
}
