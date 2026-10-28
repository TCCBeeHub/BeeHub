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
import { grupos } from "../../data/gruposMock";
import { useAuth } from "../../context/AuthContext";
import * as S from "./styles";

export function Home() {
  const { role, userName } = useAuth();
  const [busca, setBusca] = useState("");
  const [curtidas, setCurtidas] = useState({});
  const projetos = grupos.filter(
    (g) => role !== "visitante" || g.status === "concluido",
  );
  const filtrados = projetos.filter((g) =>
    `${g.nome} ${g.tema} ${g.curso} ${g.orientador}`
      .toLowerCase()
      .includes(busca.toLowerCase()),
  );

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
                <strong>{grupos.length}</strong> TCCs no acervo
              </span>
            </S.Stat>
            <S.Stat>
              <Users size={17} />
              <span>
                <strong>4</strong> cursos ativos
              </span>
            </S.Stat>
            <S.Stat>
              <TrendingUp size={17} />
              <span>
                <strong>{projetos.length}</strong> projetos visíveis
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
          <S.Post key={grupo.id}>
            <S.PostTop>
              <S.Avatar>{grupo.nome.slice(0, 1)}</S.Avatar>
              <div>
                <strong>{grupo.nome}</strong>
                <span>
                  {grupo.curso} · Orientador:{" "}
                  {grupo.orientador || "não definido"}
                </span>
              </div>
              <S.Status $done={grupo.status === "concluido"}>
                {grupo.status === "concluido" ? "Concluído" : "Em andamento"}
              </S.Status>
            </S.PostTop>
            <S.PostTitle>{grupo.tema}</S.PostTitle>
            <S.PostText>{grupo.descricao}</S.PostText>
            <S.Tags>
              {grupo.participantes.slice(0, 3).map((p) => (
                <S.Tag key={p}>{p}</S.Tag>
              ))}
            </S.Tags>
            <S.PostFooter>
              <button onClick={() => toggleLike(grupo.id)}>
                <Heart
                  size={16}
                  fill={curtidas[grupo.id] ? "currentColor" : "none"}
                />{" "}
                {curtidas[grupo.id] ? 1 : 0} curtida(s)
              </button>
              <S.PostLink as={Link} to={`/projeto/${grupo.id}`}>
                <MessageCircle size={16} /> {grupo.comentarios.length}{" "}
                comentário(s)
              </S.PostLink>
              <S.PostLink as={Link} to={`/projeto/${grupo.id}`}>
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
