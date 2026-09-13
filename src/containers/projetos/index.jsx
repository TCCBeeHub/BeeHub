import { useMemo, useRef, useState } from "react";
import {
  Check,
  Users,
  ListChecks,
  UploadCloud,
  MessageCircle,
  Trash2,
  Eye,
  FileText,
} from "lucide-react";
import { grupos } from "../../data/gruposMock";
import * as S from "./styles";

const meuGrupo = grupos[0];

const ETAPAS_INICIAIS = [
  {
    id: "tema",
    titulo: "Tema definido",
    descricao: "Escolha e aprovação do tema com o orientador",
    concluida: true,
  },
  {
    id: "intro",
    titulo: "Introdução",
    descricao: "Justificativa, objetivos e problema de pesquisa",
    concluida: true,
  },
  {
    id: "dev",
    titulo: "Desenvolvimento",
    descricao: "Metodologia e execução do projeto/protótipo",
    concluida: false,
  },
  {
    id: "resultados",
    titulo: "Resultados e discussão",
    descricao: "Análise dos dados/resultados obtidos",
    concluida: false,
  },
  {
    id: "revisao",
    titulo: "Revisão do orientador",
    descricao: "Ajustes solicitados pelo professor/orientador",
    concluida: false,
  },
  {
    id: "entrega",
    titulo: "Entrega final",
    descricao: "Envio da versão definitiva do TCC",
    concluida: false,
  },
];

const DOCUMENTOS_INICIAIS = {
  arquivoCientifico: {
    label: "Arquivo Científico",
    file: null,
    enviado: false,
  },
  projeto: { label: "Projeto", file: null, enviado: false },
  slide: { label: "Slide", file: null, enviado: false },
};

export function Projetos() {
  const [etapas, setEtapas] = useState(ETAPAS_INICIAIS);
  const [documentos, setDocumentos] = useState(() => {
    try {
      const saved =
        JSON.parse(localStorage.getItem("beehub-arquivos") || "{}")[
          meuGrupo.id
        ] || {};
      return Object.fromEntries(
        Object.entries(DOCUMENTOS_INICIAIS).map(([key, base]) => [
          key,
          saved[key]
            ? {
                ...base,
                file: {
                  ...saved[key],
                  url: saved[key].dataUrl || saved[key].url,
                },
                enviado: !!saved[key].enviado,
              }
            : base,
        ]),
      );
    } catch {
      return DOCUMENTOS_INICIAIS;
    }
  });
  const [mensagem, setMensagem] = useState("");
  const [arquivoVisualizacao, setArquivoVisualizacao] = useState(null);
  const urlsRef = useRef([]);

  const concluidas = etapas.filter((e) => e.concluida).length;
  const progresso = Math.round((concluidas / etapas.length) * 100);

  const proximaEtapa = useMemo(
    () => etapas.findIndex((e) => !e.concluida),
    [etapas],
  );

  const toggleEtapa = (index) => {
    setMensagem("");
    const etapa = etapas[index];
    if (!etapa.concluida && index !== proximaEtapa) {
      setMensagem("Conclua a etapa anterior antes de confirmar esta etapa.");
      return;
    }
    if (etapa.concluida && etapas.slice(index + 1).some((e) => e.concluida)) {
      setMensagem(
        "Não é possível desfazer esta etapa enquanto uma etapa posterior estiver concluída.",
      );
      return;
    }
    setEtapas((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, concluida: !item.concluida } : item,
      ),
    );
  };

  const handleArquivo = (chave) => (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = URL.createObjectURL(file);
    urlsRef.current.push(url);
    const reader = new FileReader();
    reader.onload = () => {
      const fileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        url,
        dataUrl: reader.result,
      };
      setDocumentos((prev) => ({
        ...prev,
        [chave]: { ...prev[chave], file: fileInfo, enviado: false },
      }));
      try {
        const current = JSON.parse(
          localStorage.getItem("beehub-arquivos") || "{}",
        );
        current[meuGrupo.id] = {
          ...(current[meuGrupo.id] || {}),
          [chave]: fileInfo,
        };
        localStorage.setItem("beehub-arquivos", JSON.stringify(current));
      } catch {
        // Arquivos grandes podem exceder o limite do localStorage; o upload continua disponível nesta sessão.
      }
      setMensagem(
        "Arquivo selecionado. Clique em Enviar para encaminhá-lo ao orientador.",
      );
    };
    reader.readAsDataURL(file);
  };

  const handleEnviar = (chave) => (e) => {
    e.preventDefault();
    if (!documentos[chave].file) {
      setMensagem("Escolha um arquivo do computador antes de enviar.");
      return;
    }
    setDocumentos((prev) => ({
      ...prev,
      [chave]: { ...prev[chave], enviado: true },
    }));
    try {
      const current = JSON.parse(
        localStorage.getItem("beehub-arquivos") || "{}",
      );
      if (current[meuGrupo.id]?.[chave])
        current[meuGrupo.id][chave] = {
          ...current[meuGrupo.id][chave],
          enviado: true,
        };
      localStorage.setItem("beehub-arquivos", JSON.stringify(current));
    } catch {}
    setMensagem("Arquivo enviado ao orientador com sucesso.");
  };

  const handleExcluir = (chave) => {
    const current = documentos[chave].file;
    if (current?.url) URL.revokeObjectURL(current.url);
    setDocumentos((prev) => ({
      ...prev,
      [chave]: { ...prev[chave], file: null, enviado: false },
    }));
    try {
      const current = JSON.parse(
        localStorage.getItem("beehub-arquivos") || "{}",
      );
      if (current[meuGrupo.id]) {
        delete current[meuGrupo.id][chave];
        localStorage.setItem("beehub-arquivos", JSON.stringify(current));
      }
    } catch {}
    setMensagem("Arquivo removido.");
  };

  return (
    <div>
      <S.PageHeader>
        <h1>MEUS PROJETOS</h1>
        <S.CourseTag $color={meuGrupo.cor}>
          {meuGrupo.curso} · {meuGrupo.nome}
        </S.CourseTag>
      </S.PageHeader>

      {mensagem && <S.Feedback>{mensagem}</S.Feedback>}

      <S.Layout>
        <S.Column>
          <S.Card>
            <S.CardTitle>
              <ListChecks size={18} /> Etapas do TCC
            </S.CardTitle>
            <S.ProgressTrack>
              <S.ProgressFill $percent={progresso} />
            </S.ProgressTrack>
            <S.ProgressLabel>
              {concluidas} de {etapas.length} etapas concluídas ({progresso}%)
            </S.ProgressLabel>
            <S.StepList>
              {etapas.map((etapa, index) => {
                const bloqueada = !etapa.concluida && index !== proximaEtapa;
                return (
                  <S.StepRow
                    key={etapa.id}
                    type="button"
                    $locked={bloqueada}
                    onClick={() => toggleEtapa(index)}
                    disabled={bloqueada}
                  >
                    <S.StepCheck $done={etapa.concluida}>
                      {etapa.concluida && <Check size={13} />}
                    </S.StepCheck>
                    <span>
                      <S.StepTitle $done={etapa.concluida}>
                        {index + 1}. {etapa.titulo}
                      </S.StepTitle>
                      <S.StepDesc>
                        {etapa.descricao}
                        {bloqueada
                          ? " · bloqueada até concluir a anterior"
                          : ""}
                      </S.StepDesc>
                    </span>
                  </S.StepRow>
                );
              })}
            </S.StepList>
          </S.Card>

          <S.Card>
            <S.CardTitle>
              <UploadCloud size={18} /> Enviar arquivos ao professor
            </S.CardTitle>
            <S.UploadHint>
              Procure um arquivo diretamente no computador. Depois do envio,
              você ainda pode visualizar o nome e excluir o arquivo antes de
              reenviar uma nova versão.
            </S.UploadHint>
            <S.DeliverRow>
              {Object.entries(documentos).map(([chave, doc]) => (
                <S.DeliverField key={chave}>
                  <S.DeliverLabel>
                    {doc.label}
                    <S.DeliverStatus $sent={doc.enviado}>
                      {doc.enviado
                        ? "Enviado"
                        : doc.file
                          ? "Selecionado"
                          : "Pendente"}
                    </S.DeliverStatus>
                  </S.DeliverLabel>
                  <S.FilePickerRow>
                    <S.HiddenFileInput
                      id={`file-${chave}`}
                      type="file"
                      onChange={handleArquivo(chave)}
                    />
                    <S.FileChoose htmlFor={`file-${chave}`}>
                      <FileText size={15} /> Procurar no computador
                    </S.FileChoose>
                    <S.FileName title={doc.file?.name}>
                      {doc.file?.name || "Nenhum arquivo selecionado"}
                    </S.FileName>
                  </S.FilePickerRow>
                  <S.FileActions>
                    {doc.file && (
                      <S.FileAction
                        type="button"
                        onClick={() => setArquivoVisualizacao(doc.file)}
                      >
                        <Eye size={14} /> Visualizar
                      </S.FileAction>
                    )}
                    <S.DeliverButton
                      type="button"
                      onClick={handleEnviar(chave)}
                      disabled={!doc.file}
                    >
                      {doc.enviado ? "Reenviar" : "Enviar"}
                    </S.DeliverButton>
                    {doc.file && (
                      <S.DeleteButton
                        type="button"
                        onClick={() => handleExcluir(chave)}
                      >
                        <Trash2 size={14} /> Excluir
                      </S.DeleteButton>
                    )}
                  </S.FileActions>
                </S.DeliverField>
              ))}
            </S.DeliverRow>
          </S.Card>
        </S.Column>

        <S.Column>
          <S.Card>
            <S.CardTitle>
              <Users size={18} /> Meu grupo
            </S.CardTitle>
            <S.GroupMeta>
              Orientador(a): {meuGrupo.orientador || "Não definido"}
            </S.GroupMeta>
            <S.TagList>
              {meuGrupo.participantes.map((nome) => (
                <S.Tag key={nome}>{nome}</S.Tag>
              ))}
            </S.TagList>
          </S.Card>

          <S.Card>
            <S.CardTitle>
              <MessageCircle size={18} /> Comentários do orientador
            </S.CardTitle>
            {meuGrupo.comentarios.length > 0 ? (
              meuGrupo.comentarios.map((c, i) => (
                <S.CommentItem key={i}>
                  <S.CommentAuthor>
                    {c.autor}
                    <S.CommentDate>{c.data}</S.CommentDate>
                  </S.CommentAuthor>
                  <S.CommentText>{c.texto}</S.CommentText>
                </S.CommentItem>
              ))
            ) : (
              <S.EmptyText>Nenhum comentário do orientador ainda.</S.EmptyText>
            )}
          </S.Card>
        </S.Column>
      </S.Layout>

      {arquivoVisualizacao && (
        <S.PreviewOverlay onClick={() => setArquivoVisualizacao(null)}>
          <S.PreviewModal onClick={(e) => e.stopPropagation()}>
            <S.PreviewHeader>
              <div>
                <strong>{arquivoVisualizacao.name}</strong>
                <span>Visualização do arquivo antes do envio</span>
              </div>
              <button
                type="button"
                onClick={() => setArquivoVisualizacao(null)}
              >
                ×
              </button>
            </S.PreviewHeader>
            <S.PreviewBody>
              {arquivoVisualizacao.type?.startsWith("image/") ? (
                <img
                  src={arquivoVisualizacao.dataUrl || arquivoVisualizacao.url}
                  alt={`Pré-visualização ${arquivoVisualizacao.name}`}
                />
              ) : arquivoVisualizacao.type === "application/pdf" ||
                arquivoVisualizacao.type?.startsWith("text/") ? (
                <iframe
                  title={`Pré-visualização ${arquivoVisualizacao.name}`}
                  src={arquivoVisualizacao.dataUrl || arquivoVisualizacao.url}
                />
              ) : (
                <S.PreviewFallback>
                  O navegador não consegue exibir este formato diretamente. Use
                  o botão de download do navegador para conferi-lo.
                </S.PreviewFallback>
              )}
            </S.PreviewBody>
          </S.PreviewModal>
        </S.PreviewOverlay>
      )}
    </div>
  );
}
