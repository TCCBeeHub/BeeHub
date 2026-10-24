import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Search,
  BookOpen,
  TrendingUp,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import * as S from "./styles";

// Recebe a lista real de grupos e TCCs via props
export function Home({ grupos = [], tccs = [] }) {
  const { role, userName } = useAuth();
  const [busca, setBusca] = useState("");
  const [curtidas, setCurtidas] = useState({});

  // Junta as informações do grupo com as do TCC correspondente (se existir)
  const projetosCompletos = grupos.map(grupo => {
    const tcc = tccs.find(t => String(t.idGrupo) === String(grupo.idGrupo));
    return { ...grupo, tcc };
  });

  // Visitantes só veem TCCs aprovados ou publicados
  const projetosVisiveis = projetosCompletos.filter(
    (g) => role !== "visitante" || ["APROVADO", "PUBLICADO"].includes(g.tcc?.status)
  );

  const filtrados = projetosVisiveis.filter((g) => {
    const textoBusca = `${g.nomeGrupo} ${g.tcc?.tema || ""} ${g.orientacao?.curso?.nome || ""} ${g.orientacao?.professor?.nome || ""}`.toLowerCase();
    return textoBusca.includes(busca.toLowerCase());
  });

  const toggleLike = (id) =>
    setCurtidas((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <S.Page>
      <S.Hero>
        <S.HeroText>
          <S.Kicker>BEEHUB · REDE ACADÊMICA DE TCC</S.Kicker>
          <S.HeroTitle>Seu TCC organizado do tema à entrega.</S.HeroTitle>
          <S.HeroParagraph>
            O BeeHub centraliza etapas, arquivos, orientações e a descoberta de
            trabalhos produzidos por outros alunos. Aqui você acompanha sua
            produção e aprende com projetos da comunidade.
          </S.HeroParagraph>
          <S.Stats>
            <S.Stat>
              <BookOpen size={17} />
              <span>
                <strong>{projetosVisiveis.length}</strong> TCCs no acervo
              </span>
            </S.Stat>
            <S.Stat>
              <Users size={17} />
              <span>
                <strong>{new Set(projetosVisiveis.map(p => p.orientacao?.curso?.idCurso)).size}</strong> cursos ativos
              </span>
            </S.Stat>
            <S.Stat>
              <TrendingUp size={17} />
              <span>
                <strong>{projetosVisiveis.length}</strong> projetos visíveis
              </span>
            </S.Stat>
          </S.Stats>
        </S.HeroText>
        <S.HeroBadge>
          <span>
            Olá,{" "}
            {userName || (role === "visitante" ? "Visitante" : "estudante")}!
          </span>
          <small>Explore, acompanhe e compartilhe conhecimento.</small>
        </S.HeroBadge>
      </S.Hero>

      <S.SectionHeader>
        <div>
          <S.SectionKicker>COMUNIDADE</S.SectionKicker>
          <h2>TCCs em destaque</h2>
          <p>Veja o que outras equipes estão produzindo.</p>
        </div>
        <S.SearchWrap>
          <Search size={16} />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Pesquisar TCC, curso ou tema..."
          />
        </S.SearchWrap>
      </S.SectionHeader>

      <S.Feed>
        {filtrados.map((grupo) => (
          <S.Post key={grupo.idGrupo}>
            <S.PostTop>
              <S.Avatar>{grupo.nomeGrupo.slice(0, 1)}</S.Avatar>
              <div>
                <strong>{grupo.nomeGrupo}</strong>
                <span>
                  {grupo.orientacao?.curso?.nome || "Curso"} · Orientador:{" "}
                  {grupo.orientacao?.professor?.nome || "não definido"}
                </span>
              </div>
              <S.Status $done={grupo.tcc?.status === "PUBLICADO" || grupo.tcc?.status === "APROVADO"}>
                {grupo.tcc?.status === "PUBLICADO" ? "Publicado" : 
                 grupo.tcc?.status === "APROVADO" ? "Aprovado" : "Em andamento"}
              </S.Status>
            </S.PostTop>
            <S.PostTitle>{grupo.tcc?.tema || "Tema não cadastrado"}</S.PostTitle>
            <S.PostText>{grupo.tcc?.descricao || "Descrição não preenchida."}</S.PostText>
            <S.Tags>
              {(grupo.alunos || []).slice(0, 3).map((aluno) => (
                <S.Tag key={aluno.rmAluno}>{aluno.nome}</S.Tag>
              ))}
            </S.Tags>
            <S.PostFooter>
              <button onClick={() => toggleLike(grupo.idGrupo)}>
                <Heart
                  size={16}
                  fill={curtidas[grupo.idGrupo] ? "currentColor" : "none"}
                />{" "}
                {curtidas[grupo.idGrupo] ? 1 : 0} curtida(s)
              </button>
              <S.PostLink as={Link} to={`/projeto/${grupo.idGrupo}`}>
                <MessageCircle size={16} /> 0 comentário(s)
              </S.PostLink>
              <S.PostLink as={Link} to={`/projeto/${grupo.idGrupo}`}>
                <ArrowUpRight size={16} /> Ver projeto
              </S.PostLink>
            </S.PostFooter>
          </S.Post>
        ))}
        {filtrados.length === 0 && (
          <S.Empty>Nenhum TCC encontrado para sua pesquisa.</S.Empty>
        )}
      </S.Feed>
    </S.Page>
  );
}