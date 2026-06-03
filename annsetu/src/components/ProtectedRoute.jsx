import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Blocks access to a page if not logged in → sends to /login
// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
