import { BookOpen, Building2, ClipboardList, FileText, GraduationCap, LayoutDashboard, MessageCircle, ShieldCheck, UserRound, UsersRound } from "lucide-react";

export const ROLE_LABELS = {
  visitante: "Visitante",
  aluno: "Aluno",
  professor: "Professor",
  administrador: "Administrador",
};

export const NAV_ITEMS = {
  visitante: [
    { id: "home", label: "Início", path: "/", icon: LayoutDashboard },
    { id: "cursos", label: "Cursos", path: "/cursos", icon: BookOpen },
    { id: "tccs", label: "TCCs públicos", path: "/tccs", icon: FileText },
  ],
  aluno: [
    { id: "home", label: "Visão geral", path: "/", icon: LayoutDashboard },
    { id: "grupos", label: "Meu grupo", path: "/grupos", icon: UsersRound },
    { id: "tccs", label: "Meu TCC", path: "/tccs", icon: FileText },
    { id: "conversas", label: "Conversas", path: "/conversas", icon: MessageCircle },
    { id: "perfil", label: "Meu perfil", path: "/perfil", icon: UserRound },
  ],
  professor: [
    { id: "home", label: "Visão geral", path: "/", icon: LayoutDashboard },
    { id: "grupos", label: "Grupos atribuídos", path: "/grupos", icon: UsersRound },
    { id: "orientacoes", label: "Orientações", path: "/orientacoes", icon: ClipboardList },
    { id: "tccs", label: "TCCs orientados", path: "/tccs", icon: FileText },
    { id: "conversas", label: "Conversas", path: "/conversas", icon: MessageCircle },
    { id: "perfil", label: "Meu perfil", path: "/perfil", icon: UserRound },
  ],
  administrador: [
    { id: "home", label: "Visão geral", path: "/", icon: LayoutDashboard },
    { id: "etecs", label: "ETECs", path: "/etecs", icon: Building2 },
    { id: "cursos", label: "Cursos", path: "/cursos", icon: BookOpen },
    { id: "alunos", label: "Alunos", path: "/alunos", icon: GraduationCap },
    { id: "professores", label: "Professores", path: "/professores", icon: UserRound },
    { id: "orientacoes", label: "Orientações", path: "/orientacoes", icon: ClipboardList },
    { id: "grupos", label: "Grupos", path: "/grupos", icon: UsersRound },
    { id: "tccs", label: "TCCs", path: "/tccs", icon: FileText },
  ],
};

export const COLLECTION_CONFIG = {
  administradores: {
    label: "Administradores",
    singular: "administrador",
    key: "idAdmin",
    columns: ["idAdmin", "userAdmin"],
    fields: ["idAdmin", "userAdmin"],
  },
  etecs: {
    label: "ETECs",
    singular: "ETEC",
    key: "codEtec",
    columns: ["codEtec", "nome"],
    fields: ["codEtec", "nome"],
  },
  cursos: {
    label: "Cursos",
    singular: "curso",
    key: "idCurso",
    columns: ["nome", "periodo", "quantAlunos", "codEtec"],
    fields: ["idCurso", "nome", "quantAlunos", "periodo", "codEtec"],
  },
  professores: {
    label: "Professores",
    singular: "professor",
    key: "rmProfessor",
    columns: ["rmProfessor", "nome", "email", "descricao"],
    fields: ["rmProfessor", "nome", "email", "linkFoto", "descricao"],
  },
  alunos: {
    label: "Alunos",
    singular: "aluno",
    key: "rmAluno",
    columns: ["rmAluno", "nome", "email", "idCurso", "idGrupo", "turma"],
    fields: ["rmAluno", "nome", "email", "linkFoto", "descricao", "turma", "idCurso", "idGrupo"],
  },
  orientacoes: {
    label: "Orientações",
    singular: "orientação",
    key: "idOrientacao",
    columns: ["idOrientacao", "idCurso", "rmProfessor", "turma"],
    fields: ["idOrientacao", "idCurso", "rmProfessor", "turma"],
  },
  grupos: {
    label: "Grupos",
    singular: "grupo",
    key: "idGrupo",
    columns: ["nomeGrupo", "ano", "idOrientacao", "capacidadeMaxima"],
    fields: ["idGrupo", "nomeGrupo", "idOrientacao", "linkFoto", "ano", "capacidadeMaxima"],
  },
  tccs: {
    label: "Trabalhos de conclusão",
    singular: "TCC",
    key: "codTCC",
    columns: ["tema", "status", "idGrupo", "dataCriacao"],
    fields: ["codTCC", "tema", "linkSlide", "linkArtigo", "status", "idGrupo", "descricao", "linkSite", "dataCriacao"],
  },
};

export const FIELD_LABELS = {
  idAdmin: "Identificador",
  userAdmin: "Usuário",
  senhaAdmin: "Senha inicial",
  codEtec: "Código da ETEC",
  nome: "Nome",
  idCurso: "Identificador do curso",
  nomeCurso: "Curso",
  quantAlunos: "Quantidade de alunos",
  periodo: "Período",
  rmProfessor: "RM do professor",
  senha: "Senha inicial",
  rmAluno: "RM do aluno",
  email: "E-mail",
  linkFoto: "Link da foto",
  descricao: "Descrição",
  turma: "Turma",
  idGrupo: "Grupo",
  idOrientacao: "Orientação",
  nomeGrupo: "Nome do grupo",
  ano: "Ano",
  capacidadeMaxima: "Capacidade máxima",
  codTCC: "Código do TCC",
  tema: "Tema",
  linkSlide: "Link dos slides",
  linkArtigo: "Link do artigo",
  status: "Status",
  linkSite: "Link do site",
  dataCriacao: "Data de criação",
};

export const ACCOUNT_PASSWORD_FIELDS = {
  administradores: "senhaAdmin",
  alunos: "senha",
  professores: "senha",
};

export const STATUS_LABELS = {
  EM_ANDAMENTO: "Em andamento",
  ENTREGUE: "Entregue",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
  PUBLICADO: "Publicado",
};

export const EDITABLE_FIELDS = {
  aluno: {
    alunos: ["email", "linkFoto", "descricao"],
    grupos: ["nomeGrupo", "linkFoto", "ano", "capacidadeMaxima"],
    tccs: ["tema", "linkSlide", "linkArtigo", "descricao", "linkSite"],
  },
  professor: {
    professores: ["email", "linkFoto", "descricao"],
    grupos: ["nomeGrupo", "linkFoto", "ano", "capacidadeMaxima"],
    orientacoes: ["idCurso", "turma"],
    tccs: ["tema", "linkSlide", "linkArtigo", "status", "descricao", "linkSite"],
  },
};

export const ICONS = {
  home: LayoutDashboard,
  etecs: Building2,
  cursos: BookOpen,
  alunos: GraduationCap,
  professores: UserRound,
  orientacoes: ClipboardList,
  grupos: UsersRound,
  tccs: FileText,
  administradores: ShieldCheck,
};

export const CHAT_MESSAGES = {
  aluno: [
    { sender: "professor", text: "Olá! Vamos revisar os próximos passos do projeto na próxima orientação.", time: "14:20" },
    { sender: "aluno", text: "Combinado. Estou organizando a versão atual do trabalho.", time: "14:32" },
    { sender: "professor", text: "Ótimo. Traga também as dúvidas sobre a metodologia.", time: "14:36" },
  ],
  professor: [
    { sender: "aluno", text: "Professor, já atualizamos a estrutura do TCC.", time: "09:12" },
    { sender: "professor", text: "Obrigado pelo aviso. Vou conferir com vocês na orientação.", time: "09:24" },
  ],
};
