import { apiRequest } from "./httpClient";

const COLLECTIONS = [
  "administradores",
  "etecs",
  "cursos",
  "professores",
  "alunos",
  "orientacoes",
  "grupos",
  "tccs",
];

export async function getPortalData({ signal } = {}) {
  const data = await apiRequest("/portal", { signal });
  if (
    !data ||
    COLLECTIONS.some(
      (collection) =>
        !Array.isArray(data[collection]) ||
        data[collection].some(
          (record) =>
            !record || typeof record !== "object" || Array.isArray(record),
        ),
    )
  ) {
    throw new Error(
      "A API retornou dados incompletos para o painel. Confira o contrato GET /api/portal.",
    );
  }
  if (
    data.administradores.some((item) => Object.hasOwn(item, "senhaAdmin")) ||
    data.alunos.some((item) => Object.hasOwn(item, "senha")) ||
    data.professores.some((item) => Object.hasOwn(item, "senha"))
  ) {
    throw new Error(
      "A API não deve retornar senhas ou hashes de senha nas respostas do painel.",
    );
  }
  return data;
}

export function createEntity(collection, record) {
  return apiRequest(`/${collection}`, { method: "POST", body: record });
}

export function updateEntity(collection, key, record) {
  return apiRequest(
    `/${collection}/${encodeURIComponent(String(key))}`,
    { method: "PUT", body: record },
  );
}

export function deleteEntity(collection, key) {
  return apiRequest(
    `/${collection}/${encodeURIComponent(String(key))}`,
    { method: "DELETE" },
  );
}
