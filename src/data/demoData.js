/** @typedef {import("./merModels").MerData} MerData */

/** @returns {MerData} */
export function createDemoData() {
  return {
    administradores: [
      { idAdmin: 1, userAdmin: "admin.beehub", senhaAdmin: "" },
    ],
    etecs: [
      { codEtec: "ETEC-001", nome: "ETEC Centro" },
      { codEtec: "ETEC-002", nome: "ETEC Zona Leste" },
    ],
    cursos: [
      {
        idCurso: 1,
        nome: "Desenvolvimento de Sistemas",
        quantAlunos: 38,
        periodo: "Noite",
        codEtec: "ETEC-001",
      },
      {
        idCurso: 2,
        nome: "Administração",
        quantAlunos: 32,
        periodo: "Manhã",
        codEtec: "ETEC-001",
      },
      {
        idCurso: 3,
        nome: "Desenvolvimento de Sistemas",
        quantAlunos: 35,
        periodo: "Tarde",
        codEtec: "ETEC-002",
      },
    ],
    professores: [
      {
        rmProfessor: "12345",
        senha: "",
        email: "marcos.andrade@etec.sp.gov.br",
        linkFoto: "",
        descricao: "Orientador de projetos de tecnologia e inovação.",
      },
      {
        rmProfessor: "67890",
        senha: "",
        email: "renata.silva@etec.sp.gov.br",
        linkFoto: "",
        descricao: "Orientadora de projetos de gestão e empreendedorismo.",
      },
    ],
    alunos: [
      {
        rmAluno: "2026001",
        senha: "",
        email: "ana.souza@etec.sp.gov.br",
        linkFoto: "",
        descricao: "",
        turma: "A",
        idGrupo: 1,
        idCurso: 1,
      },
      {
        rmAluno: "2026002",
        senha: "",
        email: "bruno.lima@etec.sp.gov.br",
        linkFoto: "",
        descricao: "",
        turma: "A",
        idGrupo: 1,
        idCurso: 1,
      },
      {
        rmAluno: "2026003",
        senha: "",
        email: "carla.dias@etec.sp.gov.br",
        linkFoto: "",
        descricao: "",
        turma: "A",
        idGrupo: 1,
        idCurso: 1,
      },
      {
        rmAluno: "2026004",
        senha: "",
        email: "diego.melo@etec.sp.gov.br",
        linkFoto: "",
        descricao: "",
        turma: "B",
        idGrupo: 2,
        idCurso: 2,
      },
    ],
    orientacoes: [
      { idOrientacao: 1, idCurso: 1, rmProfessor: "12345", turma: "A" },
      { idOrientacao: 2, idCurso: 2, rmProfessor: "67890", turma: "B" },
      { idOrientacao: 3, idCurso: 3, rmProfessor: "12345", turma: "A" },
    ],
    grupos: [
      {
        idGrupo: 1,
        nomeGrupo: "Equipe Horizonte",
        idOrientacao: 1,
        linkFoto: "",
        ano: 2026,
        capacidadeMaxima: 5,
      },
      {
        idGrupo: 2,
        nomeGrupo: "Equipe Ponto de Encontro",
        idOrientacao: 2,
        linkFoto: "",
        ano: 2026,
        capacidadeMaxima: 4,
      },
      {
        idGrupo: 3,
        nomeGrupo: "Equipe Circuito",
        idOrientacao: 3,
        linkFoto: "",
        ano: 2026,
        capacidadeMaxima: 5,
      },
    ],
    tccs: [
      {
        codTCC: "TCC-2026-001",
        tema: "BeeHub: organização e acompanhamento de projetos acadêmicos",
        linkSlide: "",
        linkArtigo: "",
        status: "EM_ANDAMENTO",
        idGrupo: 1,
        descricao:
          "Plataforma para apoiar a organização de grupos, orientações e trabalhos de conclusão de curso.",
        linkSite: "",
        dataCriacao: "2026-02-10",
      },
      {
        codTCC: "TCC-2026-002",
        tema: "Gestão de estoque para pequenos negócios",
        linkSlide: "",
        linkArtigo: "",
        status: "APROVADO",
        idGrupo: 2,
        descricao:
          "Estudo e protótipo de uma solução para melhorar o controle de estoque em pequenos negócios.",
        linkSite: "",
        dataCriacao: "2026-01-22",
      },
      {
        codTCC: "TCC-2025-014",
        tema: "Automação de irrigação para hortas escolares",
        linkSlide: "",
        linkArtigo: "",
        status: "PUBLICADO",
        idGrupo: 3,
        descricao:
          "Projeto acadêmico sobre monitoramento e automação da irrigação de hortas escolares.",
        linkSite: "",
        dataCriacao: "2025-03-18",
      },
    ],
  };
}
