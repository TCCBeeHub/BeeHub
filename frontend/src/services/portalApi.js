import { apiRequest } from "./httpClient";

const COLLECTION_PATHS = {
  administradores: "/admin",
  etecs: "/etec",
  cursos: "/cursos",
  professores: "/professor",
  alunos: "/aluno",
  orientacoes: "/orientacao",
  grupos: "/grupo",
  tccs: "/tcc",
};

function normalizeList(response, path) {
  const list = Array.isArray(response)
    ? response
    : response?.data ?? response?.content ?? response?.items;
  if (!Array.isArray(list)) {
    throw new Error(`A API deve retornar uma lista em GET ${path}.`);
  }
  if (
    list.some(
      (record) => !record || typeof record !== "object" || Array.isArray(record),
    )
  ) {
    throw new Error(`A API retornou registros inválidos em GET ${path}.`);
  }
  if (
    list.some((record) =>
      ["senha", "senhaAdmin", "password", "passwordHash"].some((key) =>
        Object.hasOwn(record, key),
      ),
    )
  ) {
    throw new Error(
      `A API não deve retornar senhas ou hashes de senha em GET ${path}.`,
    );
  }
  return list;
}

async function getList(
  path,
  signal,
  { clearSessionOnUnauthorized = true } = {},
) {
  return normalizeList(
    await apiRequest(path, { signal, clearSessionOnUnauthorized }),
    path,
  );
}

function uniqueById(records, field) {
  return [...new Map(records.map((record) => [String(record[field]), record])).values()];
}

function sameId(left, right) {
  return left != null && right != null && String(left) === String(right);
}

function normalizeRecords(records, collection) {
  const numericFields = {
    administradores: ["idAdmin"],
    cursos: ["idCurso", "quantAlunos"],
    alunos: ["idCurso", "idGrupo"],
    orientacoes: ["idOrientacao", "idCurso"],
    grupos: ["idGrupo", "idOrientacao", "ano", "capacidadeMaxima"],
    tccs: ["idGrupo"],
  }[collection] || [];
  const stringFields = {
    administradores: ["userAdmin"],
    etecs: ["codEtec"],
    cursos: ["codEtec"],
    professores: ["rmProfessor"],
    alunos: ["rmAluno"],
    orientacoes: ["rmProfessor", "turma"],
    grupos: [],
    tccs: ["codTCC", "status"],
  }[collection] || [];

  return records.map((record) => {
    const normalized = { ...record };
    for (const field of numericFields) {
      if (normalized[field] != null && normalized[field] !== "") {
        const value = Number(normalized[field]);
        if (!Number.isFinite(value)) {
          throw new Error(`A API retornou um valor inválido para ${field}.`);
        }
        normalized[field] = value;
      }
    }
    for (const field of stringFields) {
      if (normalized[field] != null) normalized[field] = String(normalized[field]);
    }
    return normalized;
  });
}

function filterByCourseAndClass(records, orientations) {
  const allowedPairs = new Set(
    orientations.map(
      (orientation) => `${orientation.idCurso}:${orientation.turma}`,
    ),
  );
  return records.filter((record) =>
    allowedPairs.has(`${record.idCurso}:${record.turma}`),
  );
}

export async function getPortalData({ role, user, signal } = {}) {
  if (!["administrador", "aluno", "professor", "visitante"].includes(role)) {
    throw new Error("Não foi possível identificar o perfil para carregar os dados.");
  }

  const publicRequestOptions =
    role === "visitante" ? { clearSessionOnUnauthorized: false } : undefined;
  const etecs = normalizeRecords(
    await getList("/etec", signal, publicRequestOptions),
    "etecs",
  );
  const cursoLists = await Promise.all(
    etecs.map((etec) =>
      getList(
        `/cursos/${encodeURIComponent(String(etec.codEtec))}`,
        signal,
        publicRequestOptions,
      ),
    ),
  );
  const cursos = normalizeRecords(cursoLists.flat(), "cursos");
  const uniqueCursos = uniqueById(cursos, "idCurso");

  if (role === "visitante") {
    const tccs = normalizeRecords(
      await getList("/tcc", signal, publicRequestOptions),
      "tccs",
    ).filter((tcc) => ["APROVADO", "PUBLICADO"].includes(tcc.status));
    return {
      administradores: [],
      etecs,
      cursos: uniqueCursos,
      professores: [],
      alunos: [],
      orientacoes: [],
      grupos: [],
      tccs,
    };
  }

  const baseRequests = [
    getList("/orientacao", signal),
    getList("/grupo", signal),
    getList("/tcc", signal),
  ];
  if (role === "administrador") baseRequests.push(getList("/admin", signal));

  const [orientationResponse, groupResponse, tccResponse, adminResponse = []] =
    await Promise.all(baseRequests);
  const allOrientations = normalizeRecords(orientationResponse, "orientacoes");
  const allGroups = normalizeRecords(groupResponse, "grupos");
  const allTccs = normalizeRecords(tccResponse, "tccs");
  const studentCourseId =
    role === "aluno" && user?.idCurso != null ? Number(user.idCurso) : null;
  const professorOrientations =
    role === "professor"
      ? allOrientations.filter((item) =>
          sameId(item.rmProfessor, user?.rmProfessor),
        )
      : [];
  const courseIds =
    role === "administrador"
      ? uniqueCursos.map((item) => item.idCurso)
      : role === "aluno"
        ? studentCourseId == null ||
          !Number.isSafeInteger(studentCourseId) ||
          studentCourseId < 1
          ? []
          : [studentCourseId]
        : uniqueById(professorOrientations, "idCurso").map(
            (item) => item.idCurso,
          );

  if (role === "aluno" && courseIds.length === 0) {
    throw new Error(
      "O login do aluno precisa retornar idCurso para carregar os dados vinculados.",
    );
  }
  if (role === "professor" && professorOrientations.length === 0) {
    throw new Error(
      "A API não retornou orientações vinculadas ao professor autenticado.",
    );
  }

  const memberLists = await Promise.all(
    courseIds.flatMap((idCurso) => [
      getList(`/aluno/curso/${encodeURIComponent(String(idCurso))}`, signal),
      getList(`/professor/curso/${encodeURIComponent(String(idCurso))}`, signal),
    ]),
  );
  const allStudents = normalizeRecords(
    memberLists.filter((_, index) => index % 2 === 0).flat(),
    "alunos",
  );
  const allProfessors = normalizeRecords(
    memberLists.filter((_, index) => index % 2 === 1).flat(),
    "professores",
  );
  const ownStudent =
    role === "aluno"
      ? allStudents.find((item) => sameId(item.rmAluno, user?.rmAluno))
      : null;
  if (role === "aluno" && !ownStudent) {
    throw new Error(
      "A API não retornou o aluno autenticado na lista do curso.",
    );
  }
  if (
    role === "aluno" &&
    !sameId(ownStudent.idCurso, user?.idCurso)
  ) {
    throw new Error(
      "O curso do aluno retornado pela API não corresponde ao curso da sessão.",
    );
  }
  const orientationRows =
    role === "professor"
      ? professorOrientations
      : role === "aluno"
        ? allOrientations.filter(
            (item) =>
              sameId(item.idCurso, ownStudent.idCurso) &&
              String(item.turma) === String(ownStudent.turma),
          )
        : allOrientations;

  const groups =
    role === "administrador"
      ? allGroups
      : role === "aluno"
        ? allGroups.filter((item) =>
            sameId(item.idGrupo, user?.idGrupo ?? ownStudent?.idGrupo),
          )
        : allGroups.filter((item) =>
            orientationRows.some((orientation) =>
              sameId(orientation.idOrientacao, item.idOrientacao),
            ),
          );
  const groupIds = new Set(groups.map((item) => String(item.idGrupo)));
  const scopedOrientations =
    role === "administrador"
      ? allOrientations
      : orientationRows;
  const students =
    role === "administrador"
      ? allStudents
      : role === "aluno"
        ? allStudents.filter((item) =>
            sameId(item.rmAluno, user?.rmAluno),
          )
        : filterByCourseAndClass(allStudents, orientationRows);
  const professors =
    role === "administrador"
      ? allProfessors
      : role === "professor"
        ? allProfessors.filter((item) =>
            sameId(item.rmProfessor, user?.rmProfessor),
          )
        : allProfessors.filter((item) =>
            orientationRows.some((orientation) =>
              sameId(orientation.rmProfessor, item.rmProfessor),
            ),
          );
  const tccs =
    role === "administrador"
      ? allTccs
      : allTccs.filter((item) => groupIds.has(String(item.idGrupo)));

  return {
    administradores: normalizeRecords(adminResponse, "administradores"),
    etecs,
    cursos:
      role === "administrador"
        ? uniqueCursos
        : uniqueCursos.filter((item) =>
            courseIds.some((id) => sameId(id, item.idCurso)),
          ),
    professores: uniqueById(professors, "rmProfessor"),
    alunos: uniqueById(students, "rmAluno"),
    orientacoes: uniqueById(scopedOrientations, "idOrientacao"),
    grupos: uniqueById(groups, "idGrupo"),
    tccs,
  };
}

export function createEntity(collection, record) {
  const path = COLLECTION_PATHS[collection];
  if (!path) throw new Error(`Coleção inválida: ${collection}.`);
  return apiRequest(path, { method: "POST", body: record });
}

export function updateEntity(collection, key, record) {
  const path = COLLECTION_PATHS[collection];
  if (!path) throw new Error(`Coleção inválida: ${collection}.`);
  return apiRequest(
    `${path}/${encodeURIComponent(String(key))}`,
    { method: "PUT", body: record },
  );
}

export function deleteEntity(collection, key) {
  const path = COLLECTION_PATHS[collection];
  if (!path) throw new Error(`Coleção inválida: ${collection}.`);
  return apiRequest(
    `${path}/${encodeURIComponent(String(key))}`,
    { method: "DELETE" },
  );
}
