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
      capacidadeMaxima: 5,
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

export function validateRecord(collection, record, data, editingKey) {
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
    if (collection === "alunos") return record.rmAluno === user?.rmAluno;
    if (collection === "grupos") return record.idGrupo === Number(user?.idGrupo);
    if (collection === "tccs") return record.idGrupo === Number(user?.idGrupo);
    return false;
  }
  if (role === "professor") {
    if (collection === "professores") return record.rmProfessor === user?.rmProfessor;
    if (collection === "orientacoes") return record.rmProfessor === user?.rmProfessor;
    if (collection === "grupos" || collection === "tccs") {
      const ownedOrientationIds = new Set(
        data.orientacoes
          .filter((item) => item.rmProfessor === user?.rmProfessor)
          .map((item) => item.idOrientacao),
      );
      return collection === "grupos"
        ? ownedOrientationIds.has(record.idOrientacao)
        : data.grupos.some(
            (group) =>
              group.idGrupo === record.idGrupo &&
              ownedOrientationIds.has(group.idOrientacao),
          );
    }
  }
  return false;
}

export function canCreate(role, collection, data, user) {
  if (role === "administrador") return true;
  if (collection !== "tccs" || !["aluno", "professor"].includes(role)) return false;
  const groupIds =
    role === "aluno"
      ? new Set([Number(user?.idGrupo)])
      : new Set(
          data.grupos
            .filter((group) =>
              data.orientacoes.some(
                (item) =>
                  item.idOrientacao === group.idOrientacao &&
                  item.rmProfessor === user?.rmProfessor,
              ),
            )
            .map((group) => group.idGrupo),
        );
  return [...groupIds].some(
    (idGrupo) => !data.tccs.some((item) => item.idGrupo === idGrupo),
  );
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
