import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { PortalApp, ProfilePicker } from "./containers/portal";

export default function App() {
  const { role } = useAuth();

  return (
    <Routes>
      <Route
        path="/entrar/*"
        element={role ? <Navigate to="/" replace /> : <ProfilePicker />}
      />
      <Route
        path="/*"
        element={role ? <PortalApp /> : <Navigate to="/entrar" replace />}
      />
    </Routes>
  );
}
