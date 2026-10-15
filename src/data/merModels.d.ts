export type Turma = "A" | "B";
export type Perfil = "administrador" | "aluno" | "professor" | "visitante";

export type StatusTcc =
  | "EM_ANDAMENTO"
  | "ENTREGUE"
  | "APROVADO"
  | "REPROVADO"
  | "PUBLICADO";

export interface Administrador {
  idAdmin: number;
  userAdmin: string;
  senhaAdmin: string;
}

export interface Etec {
  codEtec: string;
  nome: string;
}

export interface Curso {
  idCurso: number;
  nome: string;
  quantAlunos: number;
  periodo: string;
  codEtec: string;
}

export interface Professor {
  rmProfessor: string;
  senha: string;
  email: string;
  linkFoto: string;
  descricao?: string;
}

export interface Aluno {
  rmAluno: string;
  senha: string;
  email: string;
  linkFoto: string;
  descricao?: string;
  turma: Turma;
  idGrupo: number;
  idCurso: number;
}

export interface Orientacao {
  idOrientacao: number;
  idCurso: number;
  rmProfessor: string;
  turma: Turma;
}

export interface Grupo {
  idGrupo: number;
  nomeGrupo: string;
  idOrientacao: number;
  linkFoto: string;
  ano: number;
  capacidadeMaxima: number;
}

export interface Tcc {
  codTCC: string;
  tema: string;
  linkSlide: string;
  linkArtigo: string;
  status: StatusTcc;
  idGrupo: number;
  descricao: string;
  linkSite: string;
  dataCriacao: string;
}

export interface MerData {
  administradores: Administrador[];
  etecs: Etec[];
  cursos: Curso[];
  professores: Professor[];
  alunos: Aluno[];
  orientacoes: Orientacao[];
  grupos: Grupo[];
  tccs: Tcc[];
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export type AuthenticatedUser =
  | Pick<Administrador, "idAdmin" | "userAdmin">
  | Pick<Aluno, "rmAluno" | "email" | "idCurso" | "idGrupo">
  | Pick<Professor, "rmProfessor" | "email">;

export interface LoginResponse {
  accessToken: string;
  role: Exclude<Perfil, "visitante">;
  user: AuthenticatedUser & { displayName?: string };
}

export interface PortalData {
  administradores: Array<Omit<Administrador, "senhaAdmin">>;
  etecs: Etec[];
  cursos: Curso[];
  professores: Array<Omit<Professor, "senha">>;
  alunos: Array<Omit<Aluno, "senha">>;
  orientacoes: Orientacao[];
  grupos: Grupo[];
  tccs: Tcc[];
}
