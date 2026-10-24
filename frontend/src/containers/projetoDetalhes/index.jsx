import {
  ArrowLeft,
  BookOpen,
  Users,
  MessageCircle,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as S from "./styles";

// Recebe o grupo real e o TCC vinculado a ele via props
export function ProjetoDetalhes({ grupo, tcc }) {
  const navigate = useNavigate();
  const { role } = useAuth();

  if (!grupo) {
    return (
      <S.Empty>
        <strong>Projeto indisponível</strong>
        <span>Este projeto não foi encontrado ou não está disponível.</span>
        <S.Back onClick={() => navigate("/")}>
          <ArrowLeft size={15} /> Voltar ao dashboard
        </S.Back>
      </S.Empty>
    );
  }

  // Se for visitante, só pode ver se o TCC estiver aprovado ou publicado
  const isPublic = tcc?.status === "APROVADO" || tcc?.status === "PUBLICADO";
  
  if (role === "visitante" && !isPublic) {
    return (
      <S.Empty>
        <strong>Projeto indisponível</strong>
        <span>Este projeto ainda está em desenvolvimento e não é público.</span>
        <S.Back onClick={() => navigate("/")}>
          <ArrowLeft size={15} /> Voltar ao dashboard
        </S.Back>
      </S.Empty>
    );
  }

  return (
    <S.Page>
      <S.Back onClick={() => navigate(-1)}>
        <ArrowLeft size={15} /> Voltar
      </S.Back>
      <S.Card>
        <S.Top>
          <S.Course>{grupo.orientacao?.curso?.nome || "Curso"}</S.Course>
          <S.Status $done={isPublic}>
            {isPublic ? "Concluído" : "Em andamento"}
          </S.Status>
        </S.Top>
        <h1>{grupo.nomeGrupo}</h1>
        <S.Theme>{tcc?.tema || "Tema ainda não cadastrado"}</S.Theme>
        <S.Body>{tcc?.descricao || "Descrição não informada."}</S.Body>
        <S.MetaGrid>
          <S.Meta>
            <BookOpen size={16} />
            <div>
              <span>Orientador</span>
              <strong>{grupo.orientacao?.professor?.nome || "Não definido"}</strong>
            </div>
          </S.Meta>
          <S.Meta>
            <Users size={16} />
            <div>
              <span>Participantes</span>
              <strong>{(grupo.alunos || []).length}</strong>
            </div>
          </S.Meta>
          <S.Meta>
            <MessageCircle size={16} />
            <div>
              <span>Status do TCC</span>
              <strong>{tcc?.status || "Sem TCC"}</strong>
            </div>
          </S.Meta>
        </S.MetaGrid>
        <S.Section>
          <h2>Equipe</h2>
          <S.Tags>
            {(grupo.alunos || []).map((aluno) => (
              <S.Tag key={aluno.rmAluno}>{aluno.nome}</S.Tag>
            ))}
          </S.Tags>
        </S.Section>
        <S.Section>
          <h2>Arquivos publicados</h2>
          <S.FileInfo>
            <FileText size={17} />
            <span>
              {isPublic
                ? "O trabalho está registrado no acervo do BeeHub e pode ser acessado."
                : "Este projeto ainda está em desenvolvimento e seus arquivos internos não são públicos."}
            </span>
          </S.FileInfo>
        </S.Section>
      </S.Card>
    </S.Page>
  );
}