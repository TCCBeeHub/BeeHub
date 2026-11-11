import { ACCOUNT_PASSWORD_FIELDS, COLLECTION_CONFIG, EDITABLE_FIELDS, FIELD_LABELS } from "./portal-config";

export function getBlankRecord(collection, data) {
  const max = (key) =>
    Math.max(0, ...(data[collection] || []).map((item) => Number(item[key]) || 0)) + 1;
  const defaults = {
    administradores: { idAdmin: max("idAdmin"), userAdmin: "", senhaAdmin: "" },
    etecs: { codEtec: "", nome: "" },
    cursos: { idCurso: max("idCurso"), nome: "", quantAlunos: 0, periodo: "", codEtec: "" },
    professores: { rmProfessor: "", senha: "", email: "", linkFoto: "", descricao: "" },
    alunos: {
      rmAluno: "",
      senha: "",
      email: "",
      linkFoto: "",
      descricao: "",
      turma: "A",
      idGrupo: "",
      idCurso: "",
    },
    orientacoes: { idOrientacao: max("idOrientacao"), idCurso: "", rmProfessor: "", turma: "A" },
    grupos: {
      idGrupo: max("idGrupo"),
      nomeGrupo: "",
      idOrientacao: "",
      linkFoto: "",
      ano: new Date().getFullYear(),
      capacidadeMaxima: 4,
    },
    tccs: {
      codTCC: "",
      tema: "",
      linkSlide: "",
      linkArtigo: "",
      status: "EM_ANDAMENTO",
      idGrupo: "",
      descricao: "",
      linkSite: "",
      dataCriacao: new Date().toISOString().slice(0, 10),
    },
  };
  return defaults[collection];
}

export function getNextTccCode(data) {
  const usedCodes = new Set(data.tccs.map((item) => item.codTCC));
  let next = data.tccs.length + 1;
  while (
    usedCodes.has(
      `TCC-${new Date().getFullYear()}-${String(next).padStart(3, "0")}`,
    )
  ) {
    next += 1;
  }
  return `TCC-${new Date().getFullYear()}-${String(next).padStart(3, "0")}`;
}

export function validateRecord(collection, record, data, editingKey, role, user) {
  const config = COLLECTION_CONFIG[collection];
  const key = config.key;
  const generatedCourseId = collection === "cursos" && !editingKey;
  if (!generatedCourseId && !String(record[key] ?? "").trim()) {
    return `${FIELD_LABELS[key]} é obrigatório.`;
  }
  if (
    !editingKey &&
    ACCOUNT_PASSWORD_FIELDS[collection] &&
    !String(record[ACCOUNT_PASSWORD_FIELDS[collection]] ?? "").trim()
  ) {
    return "Informe uma senha inicial para a nova conta.";
  }
  if (
    !generatedCourseId &&
    data[collection].some(
      (item) =>
        String(item[key]) === String(record[key]) &&
        String(item[key]) !== String(editingKey ?? ""),
    )
  ) {
    return `${FIELD_LABELS[key]} já está cadastrado.`;
  }
  if (record.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) {
    return "Informe um e-mail válido.";
  }
  if (collection === "cursos" && !data.etecs.some((item) => item.codEtec === record.codEtec)) {
    return "Selecione uma ETEC cadastrada.";
  }
  if (
    collection === "orientacoes" &&
    (!data.cursos.some((item) => item.idCurso === Number(record.idCurso)) ||
      !data.professores.some((item) => item.rmProfessor === record.rmProfessor))
  ) {
    return "Selecione um curso e um professor cadastrados.";
  }
  if (collection === "orientacoes") {
    const affectedGroups = data.grupos.filter(
      (item) => item.idOrientacao === Number(record.idOrientacao),
    );
    const courseMismatch = affectedGroups.some((group) => {
      const courseId = Number(record.idCurso);
      return data.alunos.some(
        (student) =>
          student.idGrupo === group.idGrupo && student.idCurso !== courseId,
      );
    });
    if (courseMismatch) {
      return "O curso da orientação deve continuar compatível com os alunos vinculados aos grupos.";
    }
  }
  if (
    collection === "grupos" &&
    !data.orientacoes.some(
      (item) => item.idOrientacao === Number(record.idOrientacao),
    )
  ) {
    return "Selecione uma orientação cadastrada.";
  }
  if (
    collection === "grupos" &&
    role === "professor" &&
    !data.orientacoes.some(
      (item) =>
        item.idOrientacao === Number(record.idOrientacao) &&
        String(item.rmProfessor) === String(user?.rmProfessor),
    )
  ) {
    return "Selecione uma orientação vinculada ao seu perfil.";
  }
  if (collection === "alunos") {
    const course = data.cursos.find(
      (item) => item.idCurso === Number(record.idCurso),
    );
    if (!course) return "Selecione um curso cadastrado.";
    if (record.idGrupo == null || record.idGrupo === "") return "";
    const group = data.grupos.find(
      (item) => item.idGrupo === Number(record.idGrupo),
    );
    const orientation = data.orientacoes.find(
      (item) => item.idOrientacao === group?.idOrientacao,
    );
    if (!group) return "Selecione um grupo cadastrado.";
    if (orientation?.idCurso !== course.idCurso) {
      return "O curso do aluno deve corresponder ao curso da orientação do grupo.";
    }
    const groupCount = data.alunos.filter(
      (item) =>
        item.idGrupo === group.idGrupo &&
        item.rmAluno !== editingKey,
    ).length;
    if (groupCount >= Number(group.capacidadeMaxima)) {
      return "O grupo já atingiu sua capacidade máxima.";
    }
  }
  if (collection === "tccs") {
    const groupId = Number(record.idGrupo);
    if (!data.grupos.some((item) => item.idGrupo === groupId)) {
      return "Selecione um grupo cadastrado.";
    }
    if (
      data.tccs.some(
        (item) =>
          item.idGrupo === groupId && item.codTCC !== editingKey,
      )
    ) {
      return "Cada grupo pode possuir apenas um TCC.";
    }
  }
  if (collection === "grupos") {
    if (
      !Number.isInteger(Number(record.capacidadeMaxima)) ||
      Number(record.capacidadeMaxima) < 1 ||
      Number(record.capacidadeMaxima) > 4
    ) {
      return "A capacidade do grupo deve estar entre 1 e 4 alunos.";
    }
    const previousGroup = data.grupos.find(
      (item) => String(item.idGrupo) === String(record.idGrupo),
    );
    if (
      !Number.isInteger(Number(record.ano)) ||
      (Number(record.ano) < new Date().getFullYear() &&
        (!editingKey || Number(previousGroup?.ano) !== Number(record.ano)))
    ) {
      return "O ano do grupo não pode ser anterior ao ano atual.";
    }
    const orientation = data.orientacoes.find(
      (item) => item.idOrientacao === Number(record.idOrientacao),
    );
    const studentCourseMismatch = data.alunos.some(
      (student) =>
        student.idGrupo === Number(record.idGrupo) &&
        student.idCurso !== orientation?.idCurso,
    );
    if (studentCourseMismatch) {
      return "A orientação do grupo deve corresponder ao curso dos alunos vinculados.";
    }
    const count = data.alunos.filter(
      (item) => item.idGrupo === Number(record.idGrupo),
    ).length;
    if (Number(record.capacidadeMaxima) < count) {
      return `A capacidade não pode ser inferior aos ${count} aluno(s) vinculados.`;
    }
  }
  return "";
}

export function canEdit(role, collection, record, user, data) {
  if (role === "administrador") return true;
  if (role === "aluno") {
    if (collection === "alunos") return String(record.rmAluno) === String(user?.rmAluno);
    if (collection === "grupos") return String(record.idGrupo) === String(user?.idGrupo);
    if (collection === "tccs") return String(record.idGrupo) === String(user?.idGrupo);
    return false;
  }
  if (role === "professor") {
    if (collection === "professores") return String(record.rmProfessor) === String(user?.rmProfessor);
    if (collection === "orientacoes") return String(record.rmProfessor) === String(user?.rmProfessor);
    if (collection === "grupos" || collection === "tccs") {
      const ownedOrientationIds = new Set(
        data.orientacoes
          .filter((item) => String(item.rmProfessor) === String(user?.rmProfessor))
          .map((item) => String(item.idOrientacao)),
      );
      return collection === "grupos"
        ? ownedOrientationIds.has(String(record.idOrientacao))
        : data.grupos.some(
            (group) =>
              String(group.idGrupo) === String(record.idGrupo) &&
              ownedOrientationIds.has(String(group.idOrientacao)),
          );
    }
  }
  return false;
}

export function canCreate(role, collection, data, user) {
  if (role === "administrador") return true;
  if (
    role === "professor" &&
    collection === "grupos"
  ) {
    return data.orientacoes.some(
      (item) => String(item.rmProfessor) === String(user?.rmProfessor),
    );
  }
  if (collection !== "tccs" || !["aluno", "professor"].includes(role)) return false;
  const groupIds =
    role === "aluno"
      ? new Set([Number(user?.idGrupo)])
      : new Set(
          data.grupos
            .filter((group) =>
              data.orientacoes.some(
                (item) =>
                          String(item.idOrientacao) === String(group.idOrientacao) &&
                          String(item.rmProfessor) === String(user?.rmProfessor),
              ),
            )
            .map((group) => group.idGrupo),
        );
  return [...groupIds].some(
    (idGrupo) => !data.tccs.some((item) => String(item.idGrupo) === String(idGrupo)),
  );
}

export function canDelete(role, collection, record, user, data) {
  if (role === "administrador") return true;
  if (role !== "professor" || collection !== "grupos") return false;
  return canEdit(role, collection, record, user, data);
}

export function editableFields(role, collection, config) {
  if (role === "administrador") {
    return config.fields.filter(
      (field) =>
        !["senha", "senhaAdmin"].includes(field),
    );
  }
  return EDITABLE_FIELDS[role]?.[collection] || [];
}
