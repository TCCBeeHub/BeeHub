import React from 'react';
import { Monitor, Briefcase, Stethoscope, Wrench } from 'lucide-react';
import * as S from './styles'; // Crie um styles.js dentro desta pasta

export function Cursos() {
  const cursosAtendidos = [
    { id: 1, nome: 'Análise e Desenvolvimento de Sistemas', icone: <Monitor size={32} />, cor: '#3b82f6' },
    { id: 2, nome: 'Administração', icone: <Briefcase size={32} />, cor: '#10b981' },
    { id: 3, nome: 'Enfermagem', icone: <Stethoscope size={32} />, cor: '#ef4444' },
    { id: 4, nome: 'Mecatrônica', icone: <Wrench size={32} />, cor: '#f59e0b' },
  ];

  return (
    <S.PageContainer>
      <S.Title>Cursos Integrados</S.Title>
      <S.Subtitle>Selecione o seu curso técnico para visualizar os cronogramas e diretrizes de TCC da ETEC.</S.Subtitle>

      <S.GridCursos>
        {cursosAtendidos.map((curso) => (
          <S.CursoCard key={curso.id} style={{ borderColor: curso.cor }}>
            <S.IconWrapper style={{ color: curso.cor }}>
              {curso.icone}
            </S.IconWrapper>
            <S.CursoNome>{curso.nome}</S.CursoNome>
            <S.CursoButton>Ver Diretrizes</S.CursoButton>
          </S.CursoCard>
        ))}
      </S.GridCursos>
    </S.PageContainer>
  );
}