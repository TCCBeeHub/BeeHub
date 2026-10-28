import {
  ArrowLeft,
  BookOpen,
  Users,
  MessageCircle,
  FileText,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { grupos } from "../../data/gruposMock";
import { useAuth } from "../../context/AuthContext";
import * as S from "./styles";

export function ProjetoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const grupo = grupos.find((item) => item.id === id);

  if (!grupo || (role === "visitante" && grupo.status !== "concluido")) {
    return (
      <S.Empty>
        <strong>Projeto indisponível</strong>
        <span>Este projeto não está disponível para o seu perfil.</span>
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
          <S.Course>{grupo.curso}</S.Course>
          <S.Status $done={grupo.status === "concluido"}>
            {grupo.status === "concluido" ? "Concluído" : "Em andamento"}
          </S.Status>
        </S.Top>
        <h1>{grupo.nome}</h1>
        <S.Theme>{grupo.tema}</S.Theme>
        <S.Body>{grupo.descricao}</S.Body>
        <S.MetaGrid>
          <S.Meta>
            <BookOpen size={16} />
            <div>
              <span>Orientador</span>
              <strong>{grupo.orientador || "Não definido"}</strong>
            </div>
          </S.Meta>
          <S.Meta>
            <Users size={16} />
            <div>
              <span>Participantes</span>
              <strong>{grupo.participantes.length}</strong>
            </div>
          </S.Meta>
          <S.Meta>
            <MessageCircle size={16} />
            <div>
              <span>Comentários</span>
              <strong>{grupo.comentarios.length}</strong>
            </div>
          </S.Meta>
        </S.MetaGrid>
        <S.Section>
          <h2>Equipe</h2>
          <S.Tags>
            {grupo.participantes.map((p) => (
              <S.Tag key={p}>{p}</S.Tag>
            ))}
          </S.Tags>
        </S.Section>
        <S.Section>
          <h2>Arquivos publicados</h2>
          <S.FileInfo>
            <FileText size={17} />
            <span>
              {grupo.status === "concluido"
                ? "O trabalho está registrado no acervo do BeeHub."
                : "Este projeto ainda está em desenvolvimento e seus arquivos internos não são públicos."}
            </span>
          </S.FileInfo>
        </S.Section>
      </S.Card>
    </S.Page>
  );
}
