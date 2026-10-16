import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageCircle, X } from 'lucide-react';
import { grupos as gruposIniciais } from '../../../data/gruposMock';
import * as S from './styles';

export function Grupos() {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState(gruposIniciais);
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeGrupo, setNomeGrupo] = useState('');
  const [buscaMembro, setBuscaMembro] = useState('');
  const [membros, setMembros] = useState([]);

  const handleAdicionarMembro = (e) => {
    e.preventDefault();
    const nome = buscaMembro.trim();
    if (!nome || membros.includes(nome)) return;
    // Simulado: qualquer nome digitado vira um "membro" da lista — quando
    // tiver back-end, aqui vira uma busca de verdade nos alunos cadastrados.
    setMembros((prev) => [...prev, nome]);
    setBuscaMembro('');
  };

  const handleRemoverMembro = (nome) => {
    setMembros((prev) => prev.filter((m) => m !== nome));
  };

  const handleCriarGrupo = (e) => {
    e.preventDefault();
    setGrupos((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        nome: nomeGrupo || 'Novo grupo',
        curso: 'NOVO',
        cor: '#8b5cf6',
        descricao: 'Descrição ainda não preenchida pelo grupo.',
        tema: '',
        participantes: membros,
        orientador: '',
        arquivoCientifico: '',
        projeto: '',
        slide: '',
        comentarios: [],
      },
    ]);
    setNomeGrupo('');
    setMembros([]);
    setBuscaMembro('');
    setModalAberto(false);
  };

  return (
    <div>
      <S.PageHeader>
        <h1>GRUPOS</h1>
        <S.CreateButton onClick={() => setModalAberto(true)}>
          <Plus size={16} />
          Criar novo grupo
        </S.CreateButton>
      </S.PageHeader>

      <S.Grid>
        {grupos.map((grupo) => (
          <S.GroupCard key={grupo.id} onClick={() => navigate(`/revisao/${grupo.id}`)}>
            <S.CardTopBar $color={grupo.cor} />
            <S.CardBody>
              <S.CardCourseTag $color={grupo.cor}>{grupo.curso}</S.CardCourseTag>
              <S.CardTitle>{grupo.nome}</S.CardTitle>
              <S.CardMeta>{grupo.participantes.length} participante(s)</S.CardMeta>
              <S.CardFooter>
                <span>{grupo.orientador || 'Sem orientador definido'}</span>
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
                  placeholder="Ex: 3ºDS 2026"
                  required
                />
              </S.ModalField>

              <S.ModalField>
                Procure aqui membros
                <div style={{ display: 'flex', gap: 8 }}>
                  <S.ModalInput
                    value={buscaMembro}
                    onChange={(e) => setBuscaMembro(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAdicionarMembro(e);
                    }}
                    placeholder="Nome do aluno"
                  />
                  <S.ModalCancel type="button" onClick={handleAdicionarMembro} style={{ flex: '0 0 auto' }}>
                    <Plus size={14} />
                  </S.ModalCancel>
                </div>
                {membros.length > 0 && (
                  <S.MemberChips>
                    {membros.map((nome) => (
                      <S.MemberChip key={nome}>
                        {nome}
                        <S.MemberChipRemove type="button" onClick={() => handleRemoverMembro(nome)}>
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
                <S.ModalSubmit type="submit">ENTRAR</S.ModalSubmit>
              </S.ModalActions>
            </form>
          </S.ModalCard>
        </S.Overlay>
      )}
    </div>
  );
}
