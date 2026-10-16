import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loginRequest } from "../services/authApi";

const AuthContext = createContext(null);
const SESSION_STORAGE_KEY = "beehub-session-v1";
const VALID_ROLES = ["administrador", "aluno", "professor", "visitante"];

function readStoredSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);
    if (
      !VALID_ROLES.includes(session.role) ||
      !session.user ||
      (session.role !== "visitante" && !session.accessToken)
    ) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

function clearLegacyDemoSession() {
  localStorage.removeItem("beehub-auth");
  localStorage.removeItem("beehub-demo-persona-id");
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  useEffect(() => {
    clearLegacyDemoSession();
  }, []);

  const login = useCallback(async (credentials) => {
    const result = await loginRequest(credentials);
    if (
      !result ||
      typeof result !== "object" ||
      !VALID_ROLES.includes(result.role) ||
      result.role === "visitante" ||
      typeof result.accessToken !== "string" ||
      !result.accessToken ||
      !result.user ||
      typeof result.user !== "object"
    ) {
      throw new Error("A resposta de autenticação do servidor é inválida.");
    }

    const nextSession = {
      role: result.role,
      user: result.user,
      accessToken: result.accessToken,
    };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    return nextSession;
  }, []);

  const continueAsVisitor = useCallback(() => {
    const guestSession = {
      role: "visitante",
      user: { displayName: "Visitante" },
      accessToken: "",
    };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(guestSession));
    setSession(guestSession);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
  }, []);

  useEffect(() => {
    window.addEventListener("beehub:session-expired", logout);
    return () => window.removeEventListener("beehub:session-expired", logout);
  }, [logout]);

  const value = useMemo(
    () => ({
      role: session?.role || null,
      user: session?.user || null,
      userName: session?.user?.displayName || "",
      accessToken: session?.accessToken || "",
      login,
      continueAsVisitor,
      logout,
    }),
    [session, login, continueAsVisitor, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
