import { ApiError, apiRequest } from "./httpClient";

const COLLECTION_PATHS = {
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

// Para quando "não existir" é um estado normal (ex.: grupo ainda sem TCC).
async function getOptional(path, signal) {
  try {
    return await apiRequest(path, { signal });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

const enc = (value) => encodeURIComponent(String(value));

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

/* ------------------------------------------------------------------ */
/* Adaptação: o backend devolve DTOs "resumo" (rmUsuario, codTcc, sem  */
/* ids de relacionamento). As telas usam registros planos (rmAluno,    */
/* rmProfessor, codTCC, idGrupo...). A tradução fica toda aqui.        */
/* Quando o backend passar a enviar esses campos, eles têm prioridade. */
/* ------------------------------------------------------------------ */

function fromUsuario(record, field) {
  const { rmUsuario, ...rest } = record;
  return { ...rest, [field]: rest[field] ?? rmUsuario };
}

function fromTcc(record, fallbackStatus) {
  const { codTcc, ...rest } = record;
  return {
    ...rest,
    codTCC: rest.codTCC ?? codTcc,
    status: rest.status ?? fallbackStatus,
  };
}

// GET /orientacao* hoje só traz nomeCurso/nomeEtec/turma. Descobre o idCurso
// cruzando pelos nomes (nome da Etec é único; nome do curso é único por Etec).
function findCursoId(orientation, cursos, etecs) {
  if (orientation.idCurso != null) return orientation.idCurso;
  const etec = etecs.find((item) => item.nome === orientation.nomeEtec);
  const curso = cursos.find(
    (item) =>
      item.nome === orientation.nomeCurso &&
      (!etec || sameId(item.codEtec, etec.codEtec)),
  );
  return curso ? curso.idCurso : null;
}

function adaptOrientations(list, { rmProfessor, cursos, etecs }) {
  return list.map((item, index) => ({
    ...item,
    // O índice só é um fallback para versões antigas da API sem idOrientacao.
    idOrientacao: item.idOrientacao ?? index + 1,
    idCurso: findCursoId(item, cursos, etecs),
    rmProfessor: item.rmProfessor ?? rmProfessor,
  }));
}

// GET /tcc (público) não traz idGrupo: liga pelo nome quando o nome é único.
function attachGroupId(tccs, groups) {
  return tccs.map((tcc) => {
    if (tcc.idGrupo != null) return tcc;
    const matches = groups.filter((group) => group.nomeGrupo === tcc.nomeGrupo);
    return matches.length === 1 ? { ...tcc, idGrupo: matches[0].idGrupo } : tcc;
  });
}

async function loadStudents(courseIds, signal) {
  const lists = await Promise.all(
    courseIds.map(async (idCurso) => {
      const list = await getList(`/aluno/curso/${enc(idCurso)}`, signal);
      return list.map((item) => ({
        idCurso: Number(idCurso),
        ...fromUsuario(item, "rmAluno"),
      }));
    }),
  );
  return lists.flat();
}

async function loadProfessors(courseIds, signal) {
  const lists = await Promise.all(
    courseIds.map(async (idCurso) => {
      const list = await getList(`/professor/curso/${enc(idCurso)}`, signal);
      return list.map((item) => fromUsuario(item, "rmProfessor"));
    }),
  );
  return lists.flat();
}

function finalize(data) {
  return {
    administradores: [],
    etecs: data.etecs,
    cursos: data.cursos,
    professores: normalizeRecords(
      uniqueById(data.professores, "rmProfessor"),
      "professores",
    ),
    alunos: normalizeRecords(uniqueById(data.alunos, "rmAluno"), "alunos"),
    orientacoes: normalizeRecords(
      uniqueById(data.orientacoes, "idOrientacao"),
      "orientacoes",
    ),
    grupos: normalizeRecords(uniqueById(data.grupos, "idGrupo"), "grupos"),
    tccs: normalizeRecords(data.tccs, "tccs"),
  };
}

/* ------------------------------------------------------------------ */
/* Um carregador por perfil. Cada um só chama rotas que o backend      */
/* libera para aquele perfil (ver SessaoValidator nos controllers).    */
/* ------------------------------------------------------------------ */

async function loadAdminData({ base, signal }) {
  // Busca a lista global de professores e as outras entidades
  const [orientationList, groupList, tccList, professorList] = await Promise.all([
    getList("/orientacao", signal),
    getList("/grupo", signal),
    getList("/tcc", signal),
    getList("/professor", signal), // <--- MUDANÇA AQUI: busca todos de uma vez
  ]);

  const courseIds = base.cursos.map((curso) => curso.idCurso);
  const alunos = await loadStudents(courseIds, signal); // Alunos continuam por curso
  
  const grupos = normalizeRecords(groupList, "grupos");
  
  // Transforma a lista global de professores usando o mesmo padrão dos alunos
  const professores = professorList.map((item) => fromUsuario(item, "rmProfessor"));

  return finalize({
    ...base,
    professores,
    alunos,
    orientacoes: adaptOrientations(orientationList, {
      cursos: base.cursos,
      etecs: base.etecs,
    }),
    grupos,
    tccs: attachGroupId(
      tccList.map((tcc) => fromTcc(tcc, "PUBLICADO")),
      grupos,
    ),
  });
}

async function loadProfessorData({ base, user, signal }) {
  const rm = user?.rmProfessor;
  if (rm == null || rm === "") {
    throw new Error("Não foi possível identificar o professor logado.");
  }

  const [profile, orientationList, groupList] = await Promise.all([
    apiRequest(`/professor/${enc(rm)}`, { signal }),
    getList(`/orientacao/professor/${enc(rm)}`, signal),
    getList(`/grupo/professor/${enc(rm)}`, signal),
  ]);

  const orientacoes = adaptOrientations(orientationList, {
    rmProfessor: String(rm),
    cursos: base.cursos,
    etecs: base.etecs,
  });

  // O detalhe do grupo traz nomeCurso/nomeEtec (para achar a orientação do
  // grupo) e a lista de alunos.
  const detalhes = await Promise.all(
    groupList.map((grupo) => apiRequest(`/grupo/${enc(grupo.idGrupo)}`, { signal })),
  );

  const grupos = [];
  const alunos = [];
  groupList.forEach((grupo, index) => {
    const detalhe = detalhes[index];
    const orientacao =
      orientacoes.find((item) =>
        sameId(item.idOrientacao, grupo.idOrientacao),
      ) ||
      (orientacoes.length === 1
        ? orientacoes[0]
        : orientacoes.find(
            (item) =>
              item.nomeCurso === detalhe.nomeCurso &&
              item.nomeEtec === detalhe.nomeEtec,
          ));

    grupos.push({
      ...grupo,
      idOrientacao: grupo.idOrientacao ?? orientacao?.idOrientacao,
    });
    for (const membro of detalhe.alunos ?? []) {
      alunos.push({
        idGrupo: grupo.idGrupo,
        idCurso: orientacao?.idCurso ?? undefined,
        turma: orientacao?.turma,
        ...fromUsuario(membro, "rmAluno"),
      });
    }
  });

  const tccs = (
    await Promise.all(
      grupos.map(async (grupo) => {
        const tcc = await getOptional(
          `/tcc/professor/grupo/${enc(grupo.idGrupo)}`,
          signal,
        );
        return tcc ? { ...fromTcc(tcc), idGrupo: grupo.idGrupo } : null;
      }),
    )
  ).filter(Boolean);

  const idCursoOrientado = new Set(
    orientacoes.map((item) => String(item.idCurso)),
  );

  return finalize({
    ...base,
    cursos: base.cursos.filter((curso) =>
      idCursoOrientado.has(String(curso.idCurso)),
    ),
    professores: [
      {
        rmProfessor: String(rm),
        nome: profile?.nome,
        linkFoto: profile?.linkFoto ?? profile?.urlFoto ?? user.linkFoto,
        email: profile?.email ?? user.email,
        descricao: profile?.descricao ?? user.descricao,
      },
    ],
    alunos,
    orientacoes,
    grupos,
    tccs,
  });
}

async function loadAlunoData({ base, user, signal }) {
  const rm = user?.rmAluno;
  if (rm == null || rm === "") {
    throw new Error("Não foi possível identificar o aluno logado.");
  }
  const idGrupo = user.idGrupo ?? null;

  // Aluno sem grupo é um estado válido: só não há grupo nem TCC para mostrar.
  const [perfil, grupo, tcc] = await Promise.all([
    apiRequest(`/aluno/${enc(rm)}`, { signal }),
    idGrupo != null ? apiRequest(`/grupo/${enc(idGrupo)}`, { signal }) : null,
    idGrupo != null ? getOptional(`/tcc/grupo/${enc(idGrupo)}`, signal) : null,
  ]);

  const idCurso = perfil?.curso?.idCurso ?? user.idCurso;
  const turma = perfil?.turma ?? user.turma;
  const aluno = {
    rmAluno: String(rm),
    nome: perfil?.nome,
    linkFoto: perfil?.linkFoto ?? user.linkFoto,
    email: user.email,
    descricao: user.descricao,
    turma,
    idCurso,
    idGrupo,
  };
  const colegas = (grupo?.alunos ?? [])
    .map((membro) => ({
      idGrupo,
      idCurso,
      turma,
      ...fromUsuario(membro, "rmAluno"),
    }))
    .filter((membro) => !sameId(membro.rmAluno, rm));

  const professores = grupo
    ? (await loadProfessors([idCurso], signal)).filter(
        (professor) => professor.nome === grupo.nomeOrientador,
      )
    : [];

  return finalize({
    ...base,
    cursos: base.cursos.filter((curso) => sameId(curso.idCurso, idCurso)),
    professores,
    alunos: [aluno, ...colegas],
    orientacoes: [],
    grupos: grupo
      ? [
          {
            idGrupo: grupo.idGrupo,
            nomeGrupo: grupo.nomeGrupo,
            linkFoto: grupo.linkFoto,
            ano: grupo.ano,
            nomeOrientador: grupo.nomeOrientador,
            nomeEtec: grupo.nomeEtec,
            nomeCurso: grupo.nomeCurso,
          },
        ]
      : [],
    tccs: tcc ? [{ ...fromTcc(tcc), idGrupo }] : [],
  });
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
      getList(`/cursos/${enc(etec.codEtec)}`, signal, publicRequestOptions),
    ),
  );
  const cursos = normalizeRecords(cursoLists.flat(), "cursos");
  const base = { etecs, cursos: uniqueById(cursos, "idCurso") };

  if (role === "visitante") {
    const tccs = (await getList("/tcc", signal, publicRequestOptions)).map(
      (tcc) => fromTcc(tcc, "PUBLICADO"),
    );
    return finalize({
      ...base,
      professores: [],
      alunos: [],
      orientacoes: [],
      grupos: [],
      tccs,
    });
  }

  if (role === "administrador") return loadAdminData({ base, signal });
  if (role === "professor") return loadProfessorData({ base, user, signal });
  return loadAlunoData({ base, user, signal });
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

export function updateProfessorGroup(idGrupo, record) {
  return apiRequest(`/grupo/${enc(idGrupo)}/professor`, {
    method: "PUT",
    body: {
      nomeGrupo: record.nomeGrupo,
      linkFoto: record.linkFoto,
      capacidadeMaxima: record.capacidadeMaxima,
      ano: record.ano,
    },
  });
}

export function getProfessorGroupTcc(idGrupo, signal) {
  return getOptional(`/tcc/professor/grupo/${enc(idGrupo)}`, signal);
}

export function updateProfessorGroupTcc(idGrupo, record) {
  return apiRequest(`/tcc/professor/grupo/${enc(idGrupo)}`, {
    method: "PUT",
    body: {
      linkArtigo: record.linkArtigo,
      linkSite: record.linkSite,
      linkSlide: record.linkSlide,
      feedbackOrientador: record.feedbackOrientador,
    },
  });
}

export function transitionTcc(codTcc, action) {
  const allowedActions = new Set(["aprovar", "reprovar", "publicar"]);
  if (!allowedActions.has(action)) {
    throw new Error("Ação de TCC inválida.");
  }
  return apiRequest(`/tcc/${enc(codTcc)}/${action}`, { method: "PUT" });
}

export function getGroupMessages(idGrupo, signal) {
  return getList(`/conversa/grupo/${enc(idGrupo)}`, signal);
}

export function sendGroupMessage(idGrupo, conteudo) {
  return apiRequest(`/conversa/grupo/${enc(idGrupo)}`, {
    method: "POST",
    body: { conteudo },
  });
}

export function deleteEntity(collection, key) {
  const path = COLLECTION_PATHS[collection];
  if (!path) throw new Error(`Coleção inválida: ${collection}.`);
  return apiRequest(
    `${path}/${encodeURIComponent(String(key))}`,
    { method: "DELETE" },
  );
}
