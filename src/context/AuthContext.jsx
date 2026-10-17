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
const SESSION_STORAGE_KEY = "beehub-session-cookie-v1";
const VALID_ROLES = ["administrador", "aluno", "professor", "visitante"];

function readStoredSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);
    if (
      !VALID_ROLES.includes(session.role) ||
      !session.user
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
  sessionStorage.removeItem("beehub-session-v1");
}

function getAuthenticatedUser(result, role, identifier) {
  const responseUser =
    result?.user ||
    result?.usuario ||
    result?.data?.user ||
    result?.data?.usuario ||
    result?.data ||
    result ||
    {};
  const safeFields = {
    administrador: ["idAdmin", "userAdmin", "displayName"],
    aluno: [
      "rmAluno",
      "email",
      "linkFoto",
      "descricao",
      "turma",
      "idCurso",
      "idGrupo",
      "displayName",
    ],
    professor: [
      "rmProfessor",
      "email",
      "linkFoto",
      "descricao",
      "displayName",
    ],
  }[role];
  const user = Object.fromEntries(
    safeFields
      .filter((field) => responseUser[field] !== undefined)
      .map((field) => [field, responseUser[field]]),
  );

  if (role === "administrador") user.userAdmin ||= identifier;
  if (role === "aluno") user.rmAluno ||= String(Number(identifier));
  if (role === "professor") user.rmProfessor ||= String(Number(identifier));
  if (role === "aluno") {
    for (const field of ["idCurso", "idGrupo"]) {
      if (user[field] != null && user[field] !== "") {
        const value = Number(user[field]);
        if (!Number.isFinite(value)) {
          throw new Error(`A resposta de login contém ${field} inválido.`);
        }
        user[field] = value;
      }
    }
  }
  return user;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  useEffect(() => {
    clearLegacyDemoSession();
  }, []);

  const login = useCallback(async ({ role, identifier, password }) => {
    const result = await loginRequest({ role, identifier, password });
    const nextSession = {
      role,
      user: getAuthenticatedUser(result, role, identifier),
    };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    return nextSession;
  }, []);

  const continueAsVisitor = useCallback(() => {
    const guestSession = {
      role: "visitante",
      user: { displayName: "Visitante" },
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
