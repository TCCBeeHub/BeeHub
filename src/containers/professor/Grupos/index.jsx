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
import { grupos as gruposIniciais } from "../../../data/gruposMock";
import * as S from "./styles";

const ALUNOS = gruposIniciais.flatMap((grupo) =>
  grupo.participantes.map((nome, index) => ({
    nome,
    email:
      grupo.emails?.[index] ||
      `${nome.toLowerCase().replace(/\s+/g, ".")}@etec.sp.gov.br`,
  })),
);

export function Grupos() {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState(gruposIniciais);
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeGrupo, setNomeGrupo] = useState("");
  const [buscaAluno, setBuscaAluno] = useState("");
  const [membros, setMembros] = useState([]);
  const [buscaGrupo, setBuscaGrupo] = useState("");

  const alunosEncontrados = useMemo(
    () =>
      ALUNOS.filter((aluno) =>
        `${aluno.nome} ${aluno.email}`
          .toLowerCase()
          .includes(buscaAluno.toLowerCase()),
      ).slice(0, 6),
    [buscaAluno],
  );
  const gruposFiltrados = useMemo(
    () =>
      grupos.filter((g) =>
        `${g.nome} ${g.tema} ${g.curso}`
          .toLowerCase()
          .includes(buscaGrupo.toLowerCase()),
      ),
    [grupos, buscaGrupo],
  );

  const adicionarMembro = (aluno) => {
    if (!membros.some((m) => m.email === aluno.email))
      setMembros((prev) => [...prev, aluno]);
    setBuscaAluno("");
  };

  const handleRemoverMembro = (email) =>
    setMembros((prev) => prev.filter((m) => m.email !== email));

  const handleCriarGrupo = (e) => {
    e.preventDefault();
    setGrupos((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        nome: nomeGrupo || "Novo grupo",
        curso: "NOVO",
        cor: "#8b5cf6",
        descricao: "Descrição ainda não preenchida pelo grupo.",
        tema: "",
        participantes: membros.map((m) => m.nome),
        emails: membros.map((m) => m.email),
        status: "em_andamento",
        arquivosEnviados: [],
        orientador: "",
        arquivoCientifico: "",
        projeto: "",
        slide: "",
        comentarios: [],
      },
    ]);
    setNomeGrupo("");
    setMembros([]);
    setBuscaAluno("");
    setModalAberto(false);
  };

  return (
    <div>
      <S.PageHeader>
        <div>
          <h1>GRUPOS</h1>
          <S.PageHint>
            Gerencie os grupos orientados e revise arquivos enviados pelos
            alunos.
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
          <Mail size={14} /> Para adicionar aluno, pesquise pelo e-mail
          institucional ao criar um grupo.
        </S.SearchNote>
      </S.SearchArea>

      <S.Grid>
        {gruposFiltrados.map((grupo) => (
          <S.GroupCard
            key={grupo.id}
            onClick={() => navigate(`/revisao/${grupo.id}`)}
          >
            <S.CardTopBar $color={grupo.cor} />
            <S.CardBody>
              <S.CardRow>
                <S.CardCourseTag $color={grupo.cor}>
                  {grupo.curso}
                </S.CardCourseTag>
                {grupo.arquivosEnviados?.length > 0 && (
                  <S.FileBadge>
                    <Paperclip size={12} />
                    {grupo.arquivosEnviados.length} arquivo(s)
                  </S.FileBadge>
                )}
              </S.CardRow>
              <S.CardTitle>{grupo.nome}</S.CardTitle>
              <S.CardMeta>
                {grupo.participantes.length} participante(s)
              </S.CardMeta>
              <S.CardFooter>
                <span>{grupo.orientador || "Sem orientador definido"}</span>
                {grupo.comentarios.length > 0 && (
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
                          key={aluno.email}
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
                      <S.MemberChip key={aluno.email}>
                        {aluno.nome}
                        <small>{aluno.email}</small>
                        <S.MemberChipRemove
                          type="button"
                          onClick={() => handleRemoverMembro(aluno.email)}
                        >
                          <X size={11} />
                        </S.MemberChipRemove>
                      </S.MemberChip>
                    ))}
                  </S.MemberChips>
                )}
              </S.ModalField>
              <S.ModalActions>
                <S.ModalCancel
                  type="button"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </S.ModalCancel>
                <S.ModalSubmit type="submit">CRIAR GRUPO</S.ModalSubmit>
              </S.ModalActions>
            </form>
          </S.ModalCard>
        </S.Overlay>
      )}
    </div>
  );
}
