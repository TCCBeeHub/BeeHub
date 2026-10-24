import React from "react";
import { Monitor, Briefcase, Stethoscope, Wrench, BookOpen } from "lucide-react";
import * as S from "./styles";

// Função auxiliar para escolher um ícone baseado no nome do curso
function getIconeCurso(nomeCurso) {
  const nome = nomeCurso.toLowerCase();
  if (nome.includes("sistema") || nome.includes("informática") || nome.includes("desenvolvimento")) return <Monitor size={32} />;
  if (nome.includes("administração") || nome.includes("adm")) return <Briefcase size={32} />;
  if (nome.includes("enfermagem") || nome.includes("saúde")) return <Stethoscope size={32} />;
  if (nome.includes("mecatrônica") || nome.includes("mecânica") || nome.includes("automação")) return <Wrench size={32} />;
  return <BookOpen size={32} />; // Ícone padrão
}

// Função auxiliar para escolher uma cor baseada no nome do curso
function getCorCurso(nomeCurso) {
  const nome = nomeCurso.toLowerCase();
  if (nome.includes("sistema") || nome.includes("informática") || nome.includes("desenvolvimento")) return "#3b82f6";
  if (nome.includes("administração") || nome.includes("adm")) return "#10b981";
  if (nome.includes("enfermagem") || nome.includes("saúde")) return "#ef4444";
  if (nome.includes("mecatrônica") || nome.includes("mecânica") || nome.includes("automação")) return "#f59e0b";
  return "#8b5cf6"; // Cor padrão
}

// Recebe a lista real de cursos via props
export function Cursos({ cursos = [] }) {
  return (
    <S.PageContainer>
      <S.Title>Cursos Integrados</S.Title>
      <S.Subtitle>
        Selecione o seu curso técnico para visualizar os cronogramas e
        diretrizes de TCC da ETEC.
      </S.Subtitle>

      <S.GridCursos>
        {cursos.map((curso) => {
          const cor = getCorCurso(curso.nome);
          
          return (
            <S.CursoCard key={curso.idCurso} style={{ borderColor: cor }}>
              <S.IconWrapper style={{ color: cor }}>
                {getIconeCurso(curso.nome)}
              </S.IconWrapper>
              <S.CursoNome>{curso.nome}</S.CursoNome>
              <S.CursoSubtexto>
                {curso.orientacao?.etec?.nome || curso.codEtec || "ETEC"}
              </S.CursoSubtexto>
              <S.CursoButton>Ver Diretrizes</S.CursoButton>
            </S.CursoCard>
          );
        })}
      </S.GridCursos>
    </S.PageContainer>
  );
}