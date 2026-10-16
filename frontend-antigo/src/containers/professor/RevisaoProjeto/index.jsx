import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Presentation, FolderGit2, Download, Send, Plus, X } from 'lucide-react';
import { grupos } from '../../../data/gruposMock';
import { useAuth } from '../../../context/AuthContext';
import * as S from './styles';

export function RevisaoProjeto() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { userName } = useAuth();
  const grupoOriginal = grupos.find((g) => g.id === groupId);

  const [comentarios, setComentarios] = useState(grupoOriginal?.comentarios ?? []);
  const [texto, setTexto] = useState('');
  const [participantes, setParticipantes] = useState(grupoOriginal?.participantes ?? []);
  const [novoMembro, setNovoMembro] = useState('');

  if (!grupoOriginal) {
    return (
      <div>
        <S.BackLink onClick={() => navigate('/')}>
          <ArrowLeft size={14} /> Voltar
        </S.BackLink>
        <p>Grupo não encontrado.</p>
      </div>
    );
  }

  const handleComentar = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    // Simulado: adiciona só na lista local, sem persistir em lugar nenhum ainda.
    setComentarios((prev) => [
      ...prev,
      { autor: userName || 'Professor(a)', texto, data: new Date().toLocaleDateString('pt-BR') },
    ]);
    setTexto('');
  };

  const handleAdicionarMembro = (e) => {
    e.preventDefault();
    const nome = novoMembro.trim();
    if (!nome || participantes.includes(nome)) return;
    // Simulado: adiciona o aluno na lista local do grupo, sem back-end ainda.
    setParticipantes((prev) => [...prev, nome]);
    setNovoMembro('');
  };

  const handleRemoverMembro = (nome) => {
    setParticipantes((prev) => prev.filter((p) => p !== nome));
  };

  return (
    <div>
      <S.BackLink onClick={() => navigate('/')}>
        <ArrowLeft size={14} /> Voltar pra Grupos
      </S.BackLink>

      <S.TitleRow>
        <S.ColorDot $color={grupoOriginal.cor} />
        <h1>{grupoOriginal.nome}</h1>
      </S.TitleRow>

      <S.Grid>
        {/* Coluna esquerda: dados do projeto + links dos documentos */}
        <S.Card>
          <S.SectionLabel>DESCRIÇÃO</S.SectionLabel>
          <S.BodyText>{grupoOriginal.descricao}</S.BodyText>

          <S.SectionLabel>TEMA</S.SectionLabel>
          <S.BodyText>{grupoOriginal.tema || 'Ainda não definido pelo grupo.'}</S.BodyText>

          <S.SectionLabel>PARTICIPANTES</S.SectionLabel>
          <S.TagList>
            {participantes.length > 0 ? (
              participantes.map((nome) => (
                <S.TagRemovable key={nome}>
                  {nome}
                  <S.TagRemoveButton type="button" onClick={() => handleRemoverMembro(nome)} aria-label={`Remover ${nome}`}>
                    <X size={11} />
                  </S.TagRemoveButton>
                </S.TagRemovable>
              ))
            ) : (
              <S.BodyText>Nenhum participante cadastrado ainda.</S.BodyText>
            )}
          </S.TagList>
          <S.AddMemberRow onSubmit={handleAdicionarMembro}>
            <S.AddMemberInput
              value={novoMembro}
              onChange={(e) => setNovoMembro(e.target.value)}
              placeholder="Adicionar aluno ao grupo"
            />
            <S.AddMemberButton type="submit" aria-label="Adicionar aluno">
              <Plus size={16} />
            </S.AddMemberButton>
          </S.AddMemberRow>

          <S.SectionLabel>PROFESSOR/ORIENTADOR</S.SectionLabel>
          <S.BodyText>{grupoOriginal.orientador || 'Não definido'}</S.BodyText>

          <S.SectionLabel>DOCUMENTOS</S.SectionLabel>
          <S.LinksRow>
            <S.LinkItem href={grupoOriginal.arquivoCientifico || '#'}>
              <S.LinkLeft>
                <FileText size={16} /> Arquivo Científico
              </S.LinkLeft>
              <Download size={15} />
            </S.LinkItem>
            <S.LinkItem href={grupoOriginal.projeto || '#'}>
              <S.LinkLeft>
                <FolderGit2 size={16} /> Projeto
              </S.LinkLeft>
              <Download size={15} />
            </S.LinkItem>
            <S.LinkItem href={grupoOriginal.slide || '#'}>
              <S.LinkLeft>
                <Presentation size={16} /> Slide
              </S.LinkLeft>
              <Download size={15} />
            </S.LinkItem>
          </S.LinksRow>
        </S.Card>

        {/* Coluna direita: comentar sobre o trabalho */}
        <S.Card>
          <S.SectionLabel>COMENTAR SOBRE O TRABALHO</S.SectionLabel>

          {comentarios.length > 0 ? (
            <S.CommentList>
              {comentarios.map((c, i) => (
                <S.CommentItem key={i}>
                  <S.CommentAuthor>
                    {c.autor}
                    <S.CommentDate>{c.data}</S.CommentDate>
                  </S.CommentAuthor>
                  <S.CommentText>{c.texto}</S.CommentText>
                </S.CommentItem>
              ))}
            </S.CommentList>
          ) : (
            <S.EmptyComment>Nenhum comentário ainda — seja o primeiro.</S.EmptyComment>
          )}

          <S.CommentForm onSubmit={handleComentar}>
            <S.CommentInput
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escreva um comentário sobre o andamento..."
            />
            <S.SendButton type="submit" aria-label="Enviar comentário">
              <Send size={16} />
            </S.SendButton>
          </S.CommentForm>
        </S.Card>
      </S.Grid>
    </div>
  );
}
