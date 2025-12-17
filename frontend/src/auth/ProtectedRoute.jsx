import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { isAuthenticated } from "../utils/auth";

const ProtectedRoute = ({ children, allowRoles }) => {
  const { user } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowRoles && !allowRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
