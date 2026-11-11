import { useMemo, useState, useEffect } from "react";
import {
  Plus,
  MessageCircle,
  X,
  Search,
  Paperclip,
  Mail,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createEntity, getPortalData } from "../../../services/portalApi";
import { useAuth } from "../../../context/AuthContext";
import * as S from "./styles";

export function Grupos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estados dos dados reais vindos do backend
  const [grupos, setGrupos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [orientacoes, setOrientacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeGrupo, setNomeGrupo] = useState("");
  const [idOrientacao, setIdOrientacao] = useState("");
  const [buscaAluno, setBuscaAluno] = useState("");
  const [membros, setMembros] = useState([]);
  const [buscaGrupo, setBuscaGrupo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState("");

  // Busca os dados reais do backend quando a tela carrega
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // Puxa os dados (o portalApi já filtra o que o professor pode ver)
        const data = await getPortalData({ role: "professor", user });
        setGrupos(data.grupos || []);
        setAlunos(data.alunos || []);
        setOrientacoes(data.orientacoes || []);
      } catch (err) {
        console.error("Erro ao carregar dados", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  // Filtra os alunos reais pela busca
  const alunosEncontrados = useMemo(() => {
    if (!buscaAluno) return [];
    return alunos
      .filter((aluno) =>
        `${aluno.nome} ${aluno.email}`
          .toLowerCase()
          .includes(buscaAluno.toLowerCase())
      )
      .slice(0, 6);
  }, [buscaAluno, alunos]);

  // Filtra os grupos reais pela busca
  const gruposFiltrados = useMemo(() => {
    return grupos.filter((g) =>
      `${g.nomeGrupo} ${g.tcc?.tema || ""} ${g.orientacao?.curso?.nome || ""}`
        .toLowerCase()
        .includes(buscaGrupo.toLowerCase())
    );
  }, [grupos, buscaGrupo]);

  const adicionarMembro = (aluno) => {
    if (!membros.some((m) => m.rmAluno === aluno.rmAluno))
      setMembros((prev) => [...prev, aluno]);
    setBuscaAluno("");
  };

  const handleRemoverMembro = (rmAluno) =>
    setMembros((prev) => prev.filter((m) => m.rmAluno !== rmAluno));

  const handleCriarGrupo = async (e) => {
    e.preventDefault();
    if (!idOrientacao) {
      setErro("Selecione uma orientação para o grupo.");
      return;
    }

    setIsSubmitting(true);
    setErro("");

    try {
      // Monta o JSON exato que o seu Backend Java espera
      const payload = {
        nomeGrupo: nomeGrupo.trim(),
        idOrientacao: Number(idOrientacao),
        capacidadeMaxima: 4,
        ano: new Date().getFullYear()
      };

      // Salva no banco de dados Java!
      await createEntity("grupos", payload);
      
      // Recarrega os dados do backend
      const data = await getPortalData({ role: "professor", user });
      setGrupos(data.grupos || []);

      // Limpa o formulário
      setNomeGrupo("");
      setIdOrientacao("");
      setMembros([]);
      setBuscaAluno("");
      setModalAberto(false);
    } catch (err) {
      setErro(err.message || "Erro ao criar grupo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div style={{ color: "white", padding: 20 }}>Carregando dados...</div>;

  return (
    <div>
      <S.PageHeader>
        <div>
          <h1>GRUPOS</h1>
          <S.PageHint>
            Gerencie os grupos orientados e revise arquivos enviados pelos alunos.
          </S.PageHint>
        </div>
        <S.CreateButton onClick={() => setModalAberto(true)}>
          <Plus size={16} /> Criar novo grupo
        </S.CreateButton>
      </S.PageHeader>

      <S.SearchArea>
        <S.SearchBox>
          <Search size={16} />
          <input
            value={buscaGrupo}
            onChange={(e) => setBuscaGrupo(e.target.value)}
            placeholder="Pesquisar grupo, curso ou tema..."
          />
        </S.SearchBox>
        <S.SearchNote>
          <Mail size={14} /> Pesquise pelo e-mail institucional para adicionar alunos.
        </S.SearchNote>
      </S.SearchArea>

      <S.Grid>
        {gruposFiltrados.map((grupo) => (
          <S.GroupCard
            key={grupo.idGrupo}
            onClick={() => navigate(`/revisao/${grupo.idGrupo}`)}
          >
            <S.CardTopBar $color="#8b5cf6" />
            <S.CardBody>
              <S.CardRow>
                <S.CardCourseTag $color="#8b5cf6">
                  {grupo.orientacao?.curso?.nome || "Curso"}
                </S.CardCourseTag>
                {grupo.arquivos?.length > 0 && (
                  <S.FileBadge>
                    <Paperclip size={12} />
                    {grupo.arquivos.length} arquivo(s)
                  </S.FileBadge>
                )}
              </S.CardRow>
              <S.CardTitle>{grupo.nomeGrupo}</S.CardTitle>
              <S.CardMeta>
                {(grupo.alunos || []).length} participante(s)
              </S.CardMeta>
              <S.CardFooter>
                <span>{grupo.orientacao?.professor?.nome || "Sem orientador"}</span>
              </S.CardFooter>
            </S.CardBody>
          </S.GroupCard>
        ))}
      </S.Grid>

      {modalAberto && (
        <S.Overlay onClick={() => setModalAberto(false)}>
          <S.ModalCard onClick={(e) => e.stopPropagation()}>
            <S.ModalTitle>Criar novo grupo</S.ModalTitle>
            <form onSubmit={handleCriarGrupo}>
              
              <S.ModalField>
                Nome do grupo e sala
                <S.ModalInput
                  value={nomeGrupo}
                  onChange={(e) => setNomeGrupo(e.target.value)}
                  placeholder="Ex.: 3ºDS 2026"
                  required
                />
              </S.ModalField>

              <S.ModalField>
                Selecione a Orientação
                <select 
                  value={idOrientacao} 
                  onChange={(e) => setIdOrientacao(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', background: '#1e1e24', color: '#fff', border: '1px solid #333' }}
                >
                  <option value="">Selecione o Curso/Turma</option>
                  {orientacoes.map((ori) => (
                    <option key={ori.idOrientacao} value={ori.idOrientacao}>
                      {ori.nomeCurso} - Turma {ori.grupoOrientacao}
                    </option>
                  ))}
                </select>
              </S.ModalField>

              <S.ModalField>
                Pesquisar aluno por e-mail
                <S.ModalSearchRow>
                  <Search size={15} />
                  <S.ModalSearch
                    value={buscaAluno}
                    onChange={(e) => setBuscaAluno(e.target.value)}
                    placeholder="nome ou e-mail@etec.sp.gov.br"
                  />
                </S.ModalSearchRow>
                {buscaAluno && (
                  <S.ResultList>
                    {alunosEncontrados.length ? (
                      alunosEncontrados.map((aluno) => (
                        <S.ResultButton
                          key={aluno.rmAluno}
                          type="button"
                          onClick={() => adicionarMembro(aluno)}
                        >
                          <UsersRound size={15} />
                          <span>
                            <strong>{aluno.nome}</strong>
                            <small>{aluno.email}</small>
                          </span>
                        </S.ResultButton>
                      ))
                    ) : (
                      <S.NoResult>Nenhum aluno encontrado.</S.NoResult>
                    )}
                  </S.ResultList>
                )}
                {membros.length > 0 && (
                  <S.MemberChips>
                    {membros.map((aluno) => (
                      <S.MemberChip key={aluno.rmAluno}>
                        {aluno.nome}
                        <S.MemberChipRemove
                          type="button"
                          onClick={() => handleRemoverMembro(aluno.rmAluno)}
                        >
                          <X size={11} />
                        </S.MemberChipRemove>
                      </S.MemberChip>
                    ))}
                  </S.MemberChips>
                )}
              </S.ModalField>

              {erro && <span style={{ color: "red", fontSize: "14px" }}>{erro}</span>}

              <S.ModalActions>
                <S.ModalCancel type="button" onClick={() => setModalAberto(false)}>
                  Cancelar
                </S.ModalCancel>
                <S.ModalSubmit type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "CRIANDO..." : "CRIAR GRUPO"}
                </S.ModalSubmit>
              </S.ModalActions>
            </form>
          </S.ModalCard>
        </S.Overlay>
      )}
    </div>
  );
}