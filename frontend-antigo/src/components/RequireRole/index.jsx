import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Uso: <RequireRole exclude={['visitante']}><Projetos /></RequireRole>
// Só bloqueia quem está na lista "exclude" — todo o resto passa.
export function RequireRole({ exclude = [], children }) {
  const { role } = useAuth();

  if (exclude.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
