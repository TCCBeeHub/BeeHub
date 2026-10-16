import React from 'react';
import * as S from './styles'; // Crie um styles.js dentro desta pasta

export function Sobre() {
  return (
    <S.PageContainer>
      <S.Title>Sobre o BeeHub</S.Title>
      
      <S.ContentCard>
        <S.SectionTitle>O que é a plataforma?</S.SectionTitle>
        <S.Paragraph>
          O BeeHub é um sistema web inovador voltado à gestão integrada dos processos de Trabalho de Conclusão de Curso (TCC) das unidades ETECs. A plataforma foi criada para centralizar a comunicação entre alunos e professores orientadores, organizando desde a escolha do tema até a entrega final e avaliação.
        </S.Paragraph>

        <S.SectionTitle>Quem desenvolveu?</S.SectionTitle>
        <S.Paragraph>
          Este projeto foi desenvolvido em dupla por estudantes do Ensino Médio integrado ao Técnico em Análise e Desenvolvimento de Sistemas (ADS). Vivenciando a realidade da escola, unimos nossos conhecimentos para criar uma solução que ajudasse a organizar os projetos de formatura de todas as unidades.
        </S.Paragraph>
      </S.ContentCard>
    </S.PageContainer>
  );
}