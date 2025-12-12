import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const role = (user?.role || "").toString().toLowerCase();

    const matches = (() => {
      if (!role) return false;
      if (role === requiredRole.toString().toLowerCase()) return true;
      // accept some common admin aliases
      if (requiredRole === "admin") {
        return ["admin", "administrator", "superadmin"].includes(role);
      }
      return false;
    })();

    if (!matches) {
      // redirect to root (login or landing) instead of a non-existent /dashboard
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
