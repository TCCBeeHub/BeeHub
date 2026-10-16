import { apiRequest } from "./httpClient";

const COLLECTIONS = [
  "admin",
  "etec",
  "cursos",
  "professor",
  "aluno",
  "orientacao",
  "grupo",
  "tcc",
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
    data.admin.some((item) => Object.hasOwn(item, "senhaAdmin")) ||
    data.aluno.some((item) => Object.hasOwn(item, "senha")) ||
    data.professor.some((item) => Object.hasOwn(item, "senha"))
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
