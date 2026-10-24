import { useMemo, useState } from "react";
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
import { createEntity } from "../../../services/portalApi";
import * as S from "./styles";

// Recebe a lista de grupos (do professor) e todos os alunos da plataforma via props
export function Grupos({ grupos = [], alunos = [] }) {
  const navigate = useNavigate();
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeGrupo, setNomeGrupo] = useState("");
  const [buscaAluno, setBuscaAluno] = useState("");
  const [membros, setMembros] = useState([]);
  const [buscaGrupo, setBuscaGrupo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtra os alunos reais do backend
  const alunosEncontrados = useMemo(() => {
    if (!buscaAluno) return [];
    return alunos
      .filter((aluno) =>
        `${aluno.nome || ""} ${aluno.email || ""}`
          .toLowerCase()
          .includes(buscaAluno.toLowerCase())
      )
      .slice(0, 6);
  }, [buscaAluno, alunos]);

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
    if (!nomeGrupo.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Chama o backend real para criar o grupo. 
      // (O backend vai precisar do idOrientacao, que deve estar vinculado ao professor logado)
      // Aqui passamos um payload básico. O backend espera: nomeGrupo, idOrientacao, capacidadeMaxima, ano.
      
      // ATENÇÃO: O professor logado deve ter uma orientação. Se não tiver, o backend vai barrar.
      // Para o TCC, vamos assumir que o professor já tem uma orientação criada.
      
      // Nota: Como o front não tem o idOrientacao explícito no modal, o backend precisaria
      // descobrir a orientação do professor pela sessão, ou teríamos que buscar as orientações.
      // Neste exemplo, vamos simular o envio para a rota correta.

      const payload = {
        nomeGrupo: nomeGrupo.trim(),
        // Estes campos precisam ser preenchidos ou adaptados conforme a regra do seu backend
        idOrientacao: 1, 
        capacidadeMaxima: 4,
        ano: new Date().getFullYear()
      };

      await createEntity("grupos", payload);
      
      alert("Grupo criado com sucesso! Atualize a página para vê-lo.");
      setNomeGrupo("");
      setMembros([]);
      setBuscaAluno("");
      setModalAberto(false);
      
      // O ideal aqui seria chamar uma função de recarregar os dados (refreshPortal) passada via prop
      window.location.reload(); 
    } catch (error) {
      alert(error.message || "Erro ao criar o grupo.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Mail size={14} /> Para adicionar aluno, pesquise pelo nome ou e-mail institucional ao criar um grupo.
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
                {(grupo.arquivos?.length > 0) && (
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
                <span>{grupo.orientacao?.professor?.nome || "Sem orientador definido"}</span>
                {grupo.comentarios?.length > 0 && (
                  <S.CommentDot>
                    <MessageCircle size={12} />
                    {grupo.comentarios.length}
                  </S.CommentDot>
                )}
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
                        <small>{aluno.email}</small>
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