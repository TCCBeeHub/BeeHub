import { createDemoData } from "../data/demoData";

const STORAGE_KEY = "beehub-mer-demo-data";
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

export function loadDemoData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === null) return { data: createDemoData(), error: "" };

  try {
    const data = JSON.parse(stored);
    if (
      !data ||
      COLLECTIONS.some((collection) => !Array.isArray(data[collection]))
    ) {
      throw new Error("A estrutura salva não corresponde ao modelo do BeeHub.");
    }
    return { data, error: "" };
  } catch (error) {
    return {
      data: createDemoData(),
      error:
        error instanceof Error
          ? `Não foi possível ler os dados locais: ${error.message}`
          : "Não foi possível ler os dados locais.",
    };
  }
}

export function saveDemoData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetDemoData() {
  localStorage.removeItem(STORAGE_KEY);
  return createDemoData();
}
