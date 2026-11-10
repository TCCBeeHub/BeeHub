import { COLLECTION_CONFIG, STATUS_LABELS } from "./portal-config";

export { ACCOUNT_PASSWORD_FIELDS, CHAT_MESSAGES, COLLECTION_CONFIG, EDITABLE_FIELDS, FIELD_LABELS, ICONS, NAV_ITEMS, ROLE_LABELS, STATUS_LABELS } from "./portal-config";

export function getCollectionForSection(section) {
  return COLLECTION_CONFIG[section] ? section : null;
}

export function getSectionFromPath(pathname) {
  if (pathname === "/meu-perfil") return "perfil";
  if (pathname === "/projetos" || pathname === "/revisoes") return "tccs";
  if (pathname.startsWith("/projeto/")) return "tcc-detail";
  if (pathname.startsWith("/tcc/")) return "tcc-detail";
  if (pathname.startsWith("/grupo/")) return "group-detail";
  if (pathname.startsWith("/curso/")) return "curso-tccs";
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment || "home";
}

export function getPathRecordId(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  return parts[1] ? decodeURIComponent(parts[1]) : "";
}

export function matchesId(left, right) {
  return left != null && right != null && String(left) === String(right);
}

export function getTccCourse(tcc, data) {
  const relatedCourse = tcc.curso || tcc.grupo?.curso;
  const courseId = tcc.idCurso ?? relatedCourse?.idCurso;
  if (courseId != null) {
    return data.cursos.find((course) => matchesId(course.idCurso, courseId));
  }

  const courseName = tcc.nomeCurso ?? relatedCourse?.nome;
  const schoolName = tcc.nomeEtec ?? relatedCourse?.etec?.nome;
  if (courseName) {
    return data.cursos.find((course) => {
      if (course.nome !== courseName) return false;
      if (!schoolName) return true;
      return data.etecs.some(
        (school) =>
          matchesId(school.codEtec, course.codEtec) &&
          school.nome === schoolName,
      );
    });
  }

  const group = data.grupos.find((candidate) =>
    matchesId(candidate.idGrupo, tcc.idGrupo),
  );
  const orientation = data.orientacoes.find(
    (candidate) => matchesId(candidate.idOrientacao, group?.idOrientacao),
  );
  return data.cursos.find((course) =>
    matchesId(course.idCurso, orientation?.idCurso),
  );
}

export function orientationSummary(group, data) {
  if (!group) return "Sem orientação vinculada";
  const orientation = data.orientacoes.find(
    (item) => item.idOrientacao === group.idOrientacao,
  );
  if (!orientation) return "Orientação indisponível";
  const professor = data.professores.find(
    (item) => item.rmProfessor === orientation.rmProfessor,
  );
  return `${professor?.email || `RM ${orientation.rmProfessor}`} · Turma ${orientation.turma}`;
}

export function filterCollection(role, user, data, collection) {
  const rows = data[collection] || [];
  if (role === "administrador") return rows;
  if (role === "visitante") {
    if (collection === "cursos") return rows;
    if (collection === "tccs") {
      return rows.filter((item) =>
        ["APROVADO", "PUBLICADO"].includes(item.status),
      );
    }
    return [];
  }
  if (role === "aluno") {
    if (!user) return [];
    const ownStudent = data.alunos.find((item) =>
      matchesId(item.rmAluno, user.rmAluno),
    );
    const ownGroupId = user.idGrupo ?? ownStudent?.idGrupo;
    const ownCourseId = user.idCurso ?? ownStudent?.idCurso;
    const ownGroup = data.grupos.find(
      (item) => matchesId(item.idGrupo, ownGroupId),
    );
    const ownCourse = data.cursos.find(
      (item) => matchesId(item.idCurso, ownCourseId),
    );
    if (collection === "alunos") return rows.filter((item) => matchesId(item.rmAluno, user.rmAluno));
    if (collection === "grupos") return rows.filter((item) => matchesId(item.idGrupo, ownGroup?.idGrupo));
    if (collection === "tccs") return rows.filter((item) => matchesId(item.idGrupo, ownGroup?.idGrupo));
    if (collection === "cursos") return rows.filter((item) => matchesId(item.idCurso, ownCourse?.idCurso));
    return [];
  }
  if (role === "professor") {
    if (!user) return [];
    const orientationIds = new Set(
      data.orientacoes
        .filter((item) => matchesId(item.rmProfessor, user.rmProfessor))
        .map((item) => item.idOrientacao),
    );
    const groupIds = new Set(
      data.grupos
        .filter((item) => [...orientationIds].some((id) => matchesId(id, item.idOrientacao)))
        .map((item) => item.idGrupo),
    );
    if (collection === "professores") return rows.filter((item) => matchesId(item.rmProfessor, user.rmProfessor));
    if (collection === "orientacoes") return rows.filter((item) => matchesId(item.rmProfessor, user.rmProfessor));
    if (collection === "grupos") return rows.filter((item) => [...groupIds].some((id) => matchesId(id, item.idGrupo)));
    if (collection === "tccs") return rows.filter((item) => [...groupIds].some((id) => matchesId(id, item.idGrupo)));
    return [];
  }
  return [];
}

export function formatValue(collection, field, value, data) {
  if (value === null || value === undefined || value === "") return "—";
  if (field === "status") return STATUS_LABELS[value] || value;
  if (field === "idCurso" && collection !== "cursos") {
    return data.cursos.find((item) => item.idCurso === Number(value))?.nome || value;
  }
  if (field === "nomeCurso") return String(value);
  if (field === "codEtec" && collection === "cursos") {
    return data.etecs.find((item) => item.codEtec === value)?.nome || value;
  }
  if (field === "idGrupo" && collection !== "grupos") {
    return data.grupos.find((item) => item.idGrupo === Number(value))?.nomeGrupo || value;
  }
  if (field === "idOrientacao" && collection === "grupos") {
    const orientation = data.orientacoes.find(
      (item) => item.idOrientacao === Number(value),
    );
    if (!orientation) return value;
    return `RM ${orientation.rmProfessor} · Turma ${orientation.turma}`;
  }
  if (field === "rmProfessor") return `RM ${value}`;
  if (field === "rmAluno") return `RM ${value}`;
  if (field === "dataCriacao") {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
      new Date(`${value}T12:00:00`),
    );
  }
  return String(value);
}

export function getDetailFields(role, collection, config) {
  if (role === "visitante" && collection === "tccs") {
    return ["tema", "status", "descricao", "dataCriacao", "linkArtigo", "linkSlide", "linkSite"];
  }
  return config.fields.filter((field) => !["senha", "senhaAdmin"].includes(field));
}

export function buildDeleteError(collection, record, data) {
  if (collection === "etecs" && data.cursos.some((item) => item.codEtec === record.codEtec)) {
    return "Esta ETEC possui cursos vinculados. Remova ou transfira os cursos primeiro.";
  }
  if (
    collection === "cursos" &&
    (data.alunos.some((item) => item.idCurso === record.idCurso) ||
      data.orientacoes.some((item) => item.idCurso === record.idCurso))
  ) {
    return "Este curso possui alunos ou orientações vinculados.";
  }
  if (collection === "professores" && data.orientacoes.some((item) => item.rmProfessor === record.rmProfessor)) {
    return "Este professor possui orientações vinculadas.";
  }
  if (collection === "orientacoes" && data.grupos.some((item) => item.idOrientacao === record.idOrientacao)) {
    return "Esta orientação possui grupos vinculados.";
  }
  if (
    collection === "grupos" &&
    (data.alunos.some((item) => item.idGrupo === record.idGrupo) ||
      data.tccs.some((item) => item.idGrupo === record.idGrupo))
  ) {
    return "Este grupo possui alunos ou um TCC vinculado.";
  }
  return "";
}

export function getPageTitle(section, role) {
  if (section === "group-detail") return "Espaço do grupo";
  if (section === "curso-tccs") return "TCCs do curso";
  if (section === "perfil") return "Meu perfil";
  if (section === "conversas") return "Conversas";
  return COLLECTION_CONFIG[section]?.label || (role === "visitante" ? "Explore o BeeHub" : "Visão geral");
}
