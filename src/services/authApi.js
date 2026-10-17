import { apiRequest } from "./httpClient";

const LOGIN_CONFIG = {
  administrador: {
    path: "/admin/login",
    identifierField: "user",
  },
  aluno: {
    path: "/aluno/login",
    identifierField: "rmAluno",
  },
  professor: {
    path: "/professor/login",
    identifierField: "rmProfessor",
  },
};

export function loginRequest({ role, identifier, password }) {
  const config = LOGIN_CONFIG[role];
  if (!config) {
    throw new Error("Selecione um perfil válido para entrar.");
  }

  const normalizedIdentifier = identifier.trim();
  const typedIdentifier =
    role === "administrador" ? normalizedIdentifier : Number(normalizedIdentifier);

  if (
    role !== "administrador" &&
    (!/^\d+$/.test(normalizedIdentifier) || !Number.isSafeInteger(typedIdentifier))
  ) {
    throw new Error("Informe um RM numérico válido.");
  }

  return apiRequest(
    config.path,
    {
      method: "POST",
      body: {
        [config.identifierField]: typedIdentifier,
        senha: password,
      },
      clearSessionOnUnauthorized: false,
    },
  );
}
