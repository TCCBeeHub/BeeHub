import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EntityForm } from "./EntityForms";

const professor = { rmProfessor: "500" };
const orientation = {
  idOrientacao: 1,
  idCurso: 10,
  rmProfessor: 500,
  turma: "A",
};

function renderGroupForm({
  orientacoes = [orientation],
  alunos = [],
  capacidadeMaxima = 4,
} = {}) {
  const record = {
    nomeGrupo: "Grupo teste",
    idOrientacao: orientation.idOrientacao,
    ano: new Date().getFullYear(),
    capacidadeMaxima,
    quantidadeAlunos: 1,
    alunosSelecionados: ["101"],
  };
  return renderToStaticMarkup(
    <EntityForm
      role="professor"
      user={professor}
      collection="grupos"
      record={record}
      data={{
        alunos,
        cursos: [{ idCurso: 10, nome: "Desenvolvimento de Sistemas" }],
        etecs: [],
        grupos: [],
        orientacoes,
        professores: [],
        tccs: [],
      }}
      editing={false}
      formError=""
      onChange={() => {}}
      onClose={() => {}}
      onSave={() => {}}
    />,
  );
}

describe("professor group creation", () => {
  it("shows only ungrouped students from the selected orientation's course and class", () => {
    const markup = renderGroupForm({
      alunos: [
        { rmAluno: 101, nome: "Elegível", idCurso: 10, turma: "A", idGrupo: null },
        { rmAluno: 102, nome: "Outra turma", idCurso: 10, turma: "B", idGrupo: null },
        { rmAluno: 103, nome: "Outro curso", idCurso: 20, turma: "A", idGrupo: null },
        { rmAluno: 104, nome: "Já vinculado", idCurso: 10, turma: "A", idGrupo: 2 },
      ],
    });

    expect(markup).toContain("Elegível (RM 101)");
    expect(markup).not.toContain("Outra turma (RM 102)");
    expect(markup).not.toContain("Outro curso (RM 103)");
    expect(markup).not.toContain("Já vinculado (RM 104)");
    expect(markup).not.toContain("Nenhum aluno disponível");
  });

  it("shows the empty-students message only when the selected orientation has no eligible students", () => {
    const markup = renderGroupForm();

    expect(markup).toContain("Nenhum aluno disponível para este curso/turma.");
  });

  it("reports missing orientations instead of claiming there are no students", () => {
    const markup = renderGroupForm({ orientacoes: [] });

    expect(markup).toContain("Não há orientações disponíveis para criar um grupo.");
    expect(markup).not.toContain("Nenhum aluno disponível");
  });

  it("limits the requested number of students to the group's capacity", () => {
    const markup = renderGroupForm({
      capacidadeMaxima: 2,
      alunos: [
        { rmAluno: 101, nome: "Aluno um", idCurso: 10, turma: "A", idGrupo: null },
        { rmAluno: 102, nome: "Aluno dois", idCurso: 10, turma: "A", idGrupo: null },
        { rmAluno: 103, nome: "Aluno três", idCurso: 10, turma: "A", idGrupo: null },
      ],
    });

    expect(markup).toContain('max="2"');
  });
});
