export type Turma = "A" | "B";

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
