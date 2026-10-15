import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { PortalApp, LoginPage } from "./containers/portal";

export default function App() {
  const { role } = useAuth();

  return (
    <Routes>
      <Route
        path="/entrar/*"
        element={role ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/*"
        element={role ? <PortalApp /> : <Navigate to="/entrar" replace />}
      />
    </Routes>
  );
}
