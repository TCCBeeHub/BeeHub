import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function RequireRole({ allow, exclude = [], children }) {
  const { role } = useAuth();

  if (allow?.length && !allow.includes(role))
    return <Navigate to="/" replace />;
  if (exclude.includes(role)) return <Navigate to="/" replace />;

  return children;
}
