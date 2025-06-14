import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function RequireAuth({ children }) {
  const { token, isGuest } = useAuth();

  if (!token && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireAuth;

