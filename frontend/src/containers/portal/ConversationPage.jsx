import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, UsersRound, Pencil, Trash2, X, Check } from "lucide-react";
import { getGroupMessages, sendGroupMessage, editarMensagem, excluirMensagem } from "../../services/portalApi";
import { EmptyState, PageHeading } from "./PortalShared";

function formatMessageTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function ConversationPage({ role, user, data, groupId }) {
  const activeGroupId = groupId ?? (role === "aluno" ? user?.idGrupo : null);
  const ownRm = role === "aluno" ? user?.rmAluno : user?.rmProfessor;
  
  const group = useMemo(
    () => data.grupos.find((item) => String(item.idGrupo) === String(activeGroupId)),
    [activeGroupId, data.grupos],
  );
  
  const participants = useMemo(() => {
    if (!group) return [];
    const students = data.alunos
      .filter((student) => String(student.idGrupo) === String(activeGroupId))
      .map((student) => ({
        id: student.rmAluno,
        name: student.nome || `RM ${student.rmAluno}`,
        profile: "Aluno",
        photo: student.linkFoto,
      }));
    const professor = data.professores.find(
      (item) => item.nome === group.nomeOrientador,
    );
    return professor
      ? [
          {
            id: professor.rmProfessor,
            name: professor.nome || `RM ${professor.rmProfessor}`,
            profile: "Professor orientador",
            photo: professor.linkFoto,
          },
          ...students,
        ]
      : students;
  }, [activeGroupId, data.alunos, data.professores, group]);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Estados para edição
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editBusy, setEditBusy] = useState(false);

  // useEffect corrigido direto com a lógica
  useEffect(() => {
    if (activeGroupId == null || activeGroupId === "") {
      setMessages([]);
      return;
    }
    
    const controller = new AbortController();
    setLoading(true);
    setError("");

    getGroupMessages(activeGroupId, controller.signal)
      .then((loadedMessages) => {
        if (!controller.signal.aborted) {
          // Força a ordenação cronológica no front (do mais antigo para o mais novo)
          const ordenadas = [...loadedMessages].sort((a, b) => 
            new Date(a.enviadaEm) - new Date(b.enviadaEm)
          );
          setMessages(ordenadas);
        }
      })
      .catch((loadError) => {
        if (!controller.signal.aborted) {
          setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar as conversas.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [activeGroupId]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const content = messageText.trim();
    if (!content || sending || activeGroupId == null) return;
    
    setSending(true);
    setError("");
    try {
      const savedMessage = await sendGroupMessage(activeGroupId, content);
      setMessages((current) => [...current, savedMessage].slice(-100));
      setMessageText("");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Não foi possível enviar a mensagem.");
    } finally {
      setSending(false);
    }
  };

  const handleEditSave = async (idMensagem) => {
    const content = editText.trim();
    if (!content) return;
    
    setEditBusy(true);
    setError("");
    try {
      await editarMensagem(activeGroupId, idMensagem, content);
      // Atualiza a lista localmente
      setMessages((current) => 
        current.map((msg) => 
          msg.idMensagem === idMensagem ? { ...msg, conteudo: content } : msg
        )
      );
      setEditingId(null);
      setEditText("");
    } catch (editError) {
      setError(editError instanceof Error ? editError.message : "Não foi possível editar a mensagem.");
    } finally {
      setEditBusy(false);
    }
  };

  const handleDelete = async (idMensagem) => {
    if (!window.confirm("Excluir esta mensagem?")) return;
    
    setError("");
    try {
      await excluirMensagem(activeGroupId, idMensagem);
      setMessages((current) => current.filter((msg) => msg.idMensagem !== idMensagem));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Não foi possível excluir a mensagem.");
    }
  };

  if (activeGroupId == null) {
    return <EmptyState title="Conversa indisponível" text="É necessário estar vinculado a um grupo para acessar as conversas." />;
  }

  return (
    <>
      {groupId == null && (
        <PageHeading
          eyebrow="COMUNICAÇÃO DO GRUPO"
          title="Conversas"
          description="Mensagens visíveis somente aos integrantes e ao professor orientador."
        />
      )}
      
      <div className="chat-stage-note" role="note">
        <span className="chat-stage-icon"><MessageCircle size={19} /></span>
        <span>
          <strong>{group?.nomeGrupo || "Conversa do grupo"}</strong>
          <small>As mensagens são salvas neste grupo e não aparecem em outras conversas.</small>
        </span>
      </div>

      <div className="chat-layout">
        <aside className="chat-contacts">
          <div className="chat-contacts-heading">
            <strong><UsersRound size={14} /> Integrantes</strong>
            <span>{participants.length}</span>
          </div>
          {participants.length ? participants.map((participant) => (
            <div className="chat-contact" key={participant.id}>
              {participant.photo
                ? <img className="chat-avatar" src={participant.photo} alt="" />
                : <span className="chat-avatar">{participant.profile === "Aluno" ? "A" : "P"}</span>}
              <span>
                <strong>{participant.name}</strong>
                <small>{participant.profile}</small>
              </span>
            </div>
          )) : <p className="chat-empty">Os integrantes deste grupo não foram carregados.</p>}
          <p className="chat-privacy">Somente os alunos deste grupo e seu professor orientador podem consultar ou enviar mensagens.</p>
        </aside>

        <section className="chat-window" aria-label="Mensagens do grupo">
          <header className="chat-window-header">
            <span className="chat-avatar"><UsersRound size={16} /></span>
            <span><strong>{group?.nomeGrupo || "Grupo"}</strong><small>Conversa em grupo</small></span>
            <span className="local-message-tag">PRIVADA</span>
          </header>

          <div className="chat-messages" aria-live="polite">
            {loading ? (
              <p className="chat-empty">Carregando mensagens…</p>
            ) : messages.length ? (
              messages.map((message) => {
                const mine = String(message.rmRemetente) === String(ownRm);
                const isEditing = editingId === message.idMensagem;
                
                return (
                  <div className={`message-row ${mine ? "message-mine" : ""}`} key={message.idMensagem}>
                    <div className="message-bubble">
                      {!mine && <strong>{message.nomeRemetente}</strong>}
                      
                      {isEditing ? (
                        <div className="message-edit-form">
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            maxLength={1000}
                            autoFocus
                          />
                          <button onClick={() => handleEditSave(message.idMensagem)} disabled={editBusy} title="Salvar">
                            <Check size={14} />
                          </button>
                          <button onClick={() => setEditingId(null)} title="Cancelar">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p>{message.conteudo}</p>
                          <time>{formatMessageTime(message.enviadaEm)}</time>
                          
                          {mine && (
                            <div className="message-actions">
                              <button onClick={() => { setEditingId(message.idMensagem); setEditText(message.conteudo); }} title="Editar">
                                <Pencil size={12} />
                              </button>
                              <button onClick={() => handleDelete(message.idMensagem)} title="Excluir">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="chat-empty">Ainda não há mensagens. Inicie a conversa do grupo.</p>
            )}
          </div>

          {error && <p className="form-error chat-error" role="alert">{error}</p>}

          <form className="chat-composer" onSubmit={sendMessage}>
            <input
              value={messageText}
              maxLength={1000}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="Escreva uma mensagem para o grupo"
              aria-label="Mensagem"
              disabled={sending}
            />
            <span className="chat-character-count">{messageText.length}/1000</span>
            <button type="submit" disabled={!messageText.trim() || sending} aria-label="Enviar mensagem">
              <Send size={17} />
            </button>
          </form>
        </section>
      </div>
    </>
  );
}