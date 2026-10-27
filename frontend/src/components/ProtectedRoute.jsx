
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role }) {
  const { user, isAuthenticated } = useAuth();
  console.log("User:", user);
console.log("Role:", user?.role);
console.log("Authenticated:", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/client"} replace />;
  }

  return <Outlet />;
}
