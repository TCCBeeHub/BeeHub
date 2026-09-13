import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "beehub-auth";

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { role: null, userName: "" };
    const parsed = JSON.parse(raw);
    if (!["aluno", "professor", "visitante"].includes(parsed.role))
      return { role: null, userName: "" };
    return { role: parsed.role, userName: parsed.userName || "" };
  } catch {
    return { role: null, userName: "" };
  }
}

export function AuthProvider({ children }) {
  const [{ role, userName }, setAuth] = useState(readStoredAuth);

  const loginAs = (newRole, name = "") => {
    const next = { role: newRole, userName: name };
    setAuth(next);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
  };

  const logout = () => {
    setAuth({ role: null, userName: "" });
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Mantém os dados de perfil/projetos, mas encerra a autenticação.
  };

  const value = useMemo(
    () => ({ role, userName, loginAs, logout }),
    [role, userName],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
