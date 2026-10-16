import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function RequireAuth({ children }) {
  const { role } = useAuth();

  if (!role) {
    return <Navigate to="/entrar" replace />;
  }

  return children;
}