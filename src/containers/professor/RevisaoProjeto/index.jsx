import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FileText,
  Send,
  Plus,
  X,
  Eye,
  Trash2,
  Download,
  Paperclip,
  FileCheck2,
} from "lucide-react";
import { grupos } from "../../../data/gruposMock";
import { useAuth } from "../../../context/AuthContext";
import * as S from "./styles";

function criarPreview(file) {
  if (file.dataUrl) return file.dataUrl;
  const blob = new Blob(
    [
      `Arquivo simulado do BeeHub\n\n${file.descricao || file.nome}\n\nEste painel representa a área em que o professor visualiza o material enviado pelo aluno antes de corrigir.`,
    ],
    { type: "text/plain" },
  );
  return URL.createObjectURL(blob);
}

function carregarArquivosSalvos(groupId, iniciais) {
  try {
    const saved =
      JSON.parse(localStorage.getItem("beehub-arquivos") || "{}")[groupId] ||
      {};
    const extras = Object.values(saved)
      .filter((file) => file?.enviado)
      .map((file) => ({ ...file, id: `local-${file.name}-${file.size}` }));
    const baseNames = new Set(iniciais.map((file) => file.nome));
    return [...iniciais, ...extras.filter((file) => !baseNames.has(file.name))];
  } catch {
    return iniciais;
  }
}

export function RevisaoProjeto() {
  const { groupId } = useParams();
  const { userName } = useAuth();
  const grupoOriginal = grupos.find((g) => g.id === groupId);
  const [comentarios, setComentarios] = useState(
    grupoOriginal?.comentarios ?? [],
  );
  const [texto, setTexto] = useState("");
  const [participantes, setParticipantes] = useState(
    grupoOriginal?.participantes ?? [],
  );
  const [novoMembro, setNovoMembro] = useState("");
  const [arquivos, setArquivos] = useState(() =>
    carregarArquivosSalvos(
      groupId,
      (grupoOriginal?.arquivosEnviados || []).map((f) => ({
        ...f,
        previewUrl: null,
      })),
    ),
  );
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);

  useEffect(() => () => {}, []);

  if (!grupoOriginal)
    return (
      <div>
        <p>Grupo não encontrado.</p>
      </div>
    );

  const abrirArquivo = (arquivo) => {
    if (!arquivo.previewUrl) {
      const previewUrl = criarPreview(arquivo);
      const novo = { ...arquivo, previewUrl };
      setArquivos((prev) => prev.map((f) => (f.id === arquivo.id ? novo : f)));
      setArquivoSelecionado(novo);
    } else setArquivoSelecionado(arquivo);
  };

  const excluirArquivo = (id) => {
    const target = arquivos.find((arquivo) => arquivo.id === id);
    setArquivos((prev) => prev.filter((arquivo) => arquivo.id !== id));
    if (target?.previewUrl && target.previewUrl.startsWith("blob:"))
      URL.revokeObjectURL(target.previewUrl);
    if (target?.dataUrl) {
      try {
        const current = JSON.parse(
          localStorage.getItem("beehub-arquivos") || "{}",
        );
        const group = current[groupId] || {};
        Object.keys(group).forEach((key) => {
          if (group[key]?.name === target.name) delete group[key];
        });
        current[groupId] = group;
        localStorage.setItem("beehub-arquivos", JSON.stringify(current));
      } catch {}
    }
    if (arquivoSelecionado?.id === id) setArquivoSelecionado(null);
  };

  const handleComentar = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setComentarios((prev) => [
      ...prev,
      {
        autor: userName || "Professor(a)",
        texto: texto.trim(),
        data: new Date().toLocaleDateString("pt-BR"),
      },
    ]);
    setTexto("");
  };
  const handleAdicionarMembro = (e) => {
    e.preventDefault();
    const nome = novoMembro.trim();
    if (!nome || participantes.includes(nome)) return;
    setParticipantes((prev) => [...prev, nome]);
    setNovoMembro("");
  };
  const handleRemoverMembro = (nome) =>
    setParticipantes((prev) => prev.filter((p) => p !== nome));

  return (
    <div>
      <S.TitleRow>
        <S.ColorDot $color={grupoOriginal.cor} />
        <div>
          <h1>{grupoOriginal.nome}</h1>
          <S.SubTitle>{grupoOriginal.tema}</S.SubTitle>
        </div>
      </S.TitleRow>
      <S.Grid>
        <S.Card>
          <S.SectionLabel>DESCRIÇÃO</S.SectionLabel>
          <S.BodyText>{grupoOriginal.descricao}</S.BodyText>
          <S.SectionLabel>PARTICIPANTES</S.SectionLabel>
          <S.TagList>
            {participantes.map((nome) => (
              <S.TagRemovable key={nome}>
                {nome}
                <S.TagRemoveButton
                  type="button"
                  onClick={() => handleRemoverMembro(nome)}
                >
                  <X size={11} />
                </S.TagRemoveButton>
              </S.TagRemovable>
            ))}
          </S.TagList>
          <S.AddMemberRow onSubmit={handleAdicionarMembro}>
            <S.AddMemberInput
              value={novoMembro}
              onChange={(e) => setNovoMembro(e.target.value)}
              placeholder="Adicionar aluno"
            />
            <S.AddMemberButton type="submit">
              <Plus size={16} />
            </S.AddMemberButton>
          </S.AddMemberRow>
          <S.SectionLabel>ARQUIVOS ENVIADOS PELOS ALUNOS</S.SectionLabel>
          {arquivos.length ? (
            <S.FileList>
              {arquivos.map((arquivo) => (
                <S.FileCard key={arquivo.id}>
                  <S.FileInfo>
                    <S.FileIcon>
                      <FileText size={18} />
                    </S.FileIcon>
                    <div>
                      <strong>{arquivo.nome}</strong>
                      <span>{arquivo.descricao}</span>
                    </div>
                  </S.FileInfo>
                  <S.FileButtons>
                    <S.FileButton
                      type="button"
                      onClick={() => abrirArquivo(arquivo)}
                    >
                      <Eye size={14} /> Visualizar
                    </S.FileButton>
                    {arquivo.previewUrl && (
                      <S.FileButton
                        as="a"
                        href={arquivo.previewUrl}
                        download={arquivo.nome}
                      >
                        <Download size={14} /> Baixar
                      </S.FileButton>
                    )}
                    <S.FileDelete
                      type="button"
                      onClick={() => excluirArquivo(arquivo.id)}
                    >
                      <Trash2 size={14} /> Excluir
                    </S.FileDelete>
                  </S.FileButtons>
                </S.FileCard>
              ))}
            </S.FileList>
          ) : (
            <S.EmptyComment>
              Nenhum arquivo enviado por este grupo ainda.
            </S.EmptyComment>
          )}
        </S.Card>
        <S.Card>
          <S.SectionLabel>STATUS DA ENTREGA</S.SectionLabel>
          <S.DeliverySummary>
            <FileCheck2 size={19} />
            <div>
              <strong>{arquivos.length} arquivo(s) recebido(s)</strong>
              <span>
                Abra o material para conferir antes de fazer sua correção.
              </span>
            </div>
          </S.DeliverySummary>
          <S.SectionLabel>COMENTÁRIOS SOBRE O TRABALHO</S.SectionLabel>
          {comentarios.length ? (
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
            <S.EmptyComment>Nenhum comentário ainda.</S.EmptyComment>
          )}
          <S.CommentForm onSubmit={handleComentar}>
            <S.CommentInput
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escreva sua correção ou orientação..."
            />
            <S.SendButton type="submit">
              <Send size={16} />
            </S.SendButton>
          </S.CommentForm>
        </S.Card>
      </S.Grid>

      {arquivoSelecionado && (
        <S.Overlay onClick={() => setArquivoSelecionado(null)}>
          <S.PreviewModal onClick={(e) => e.stopPropagation()}>
            <S.PreviewHeader>
              <div>
                <strong>{arquivoSelecionado.nome}</strong>
                <span>Visualização para correção</span>
              </div>
              <button onClick={() => setArquivoSelecionado(null)}>
                <X size={17} />
              </button>
            </S.PreviewHeader>
            <S.PreviewBody>
              {arquivoSelecionado.type?.startsWith("image/") ? (
                <img
                  src={
                    arquivoSelecionado.dataUrl || arquivoSelecionado.previewUrl
                  }
                  alt={`Pré-visualização ${arquivoSelecionado.nome}`}
                />
              ) : (
                <iframe
                  title={`Pré-visualização ${arquivoSelecionado.nome}`}
                  src={
                    arquivoSelecionado.dataUrl ||
                    arquivoSelecionado.previewUrl ||
                    criarPreview(arquivoSelecionado)
                  }
                />
              )}
            </S.PreviewBody>
            <S.PreviewFooter>
              <S.PreviewNote>
                <Paperclip size={14} /> Material recebido do grupo para revisão.
              </S.PreviewNote>
              <S.FileDelete
                type="button"
                onClick={() => excluirArquivo(arquivoSelecionado.id)}
              >
                <Trash2 size={14} /> Excluir arquivo
              </S.FileDelete>
            </S.PreviewFooter>
          </S.PreviewModal>
        </S.Overlay>
      )}
    </div>
  );
}
