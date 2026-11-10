import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { CHAT_MESSAGES } from "./portal-data";
import { EmptyState, PageHeading } from "./PortalShared";

export function ConversationPage({ role, user, data, selected, onSelect }) {
  const [currentSelection, setCurrentSelection] = useState(selected);
  const contacts = useMemo(() => {
    if (role === "aluno") {
      const group = data.grupos.find((item) => item.idGrupo === Number(user?.idGrupo));
      const orientation = data.orientacoes.find(
        (item) => item.idOrientacao === group?.idOrientacao,
      );
      const professor = data.professores.find(
        (item) => item.rmProfessor === orientation?.rmProfessor,
      );
      return professor
        ? [{
            id: professor.rmProfessor,
            title: `Professor · RM ${professor.rmProfessor}`,
            subtitle: professor.email,
            preview: "Orientação do seu grupo",
          }]
        : [];
    }
    const orientations = data.orientacoes.filter(
      (item) => item.rmProfessor === user?.rmProfessor,
    );
    const groupIds = new Set(
      data.grupos
        .filter((item) => orientations.some((orientation) => orientation.idOrientacao === item.idOrientacao))
        .map((item) => item.idGrupo),
    );
    return data.alunos
      .filter((item) => groupIds.has(item.idGrupo))
      .map((student) => ({
        id: student.rmAluno,
        title: `Aluno · RM ${student.rmAluno}`,
        subtitle: student.email,
        preview: data.grupos.find((item) => item.idGrupo === student.idGrupo)?.nomeGrupo || "Grupo vinculado",
      }));
  }, [data, role, user]);
  const activeId = contacts.some((contact) => contact.id === currentSelection)
    ? currentSelection
    : contacts[0]?.id;
  const activeContact = contacts.find((contact) => contact.id === activeId);
  const messages = CHAT_MESSAGES[role] || [];

  const selectContact = (id) => {
    setCurrentSelection(id);
    onSelect(id);
  };

  return (
    <>
      <PageHeading
        eyebrow="ORIENTAÇÃO ENTRE ALUNO E PROFESSOR"
        title="Conversas"
        description="A interface de conversas será conectada em uma etapa futura."
      />
      <div className="chat-stage-note">
        <span className="chat-stage-icon"><MessageCircle size={19} /></span>
        <span><strong>Módulo previsto para a próxima etapa</strong><small>As mensagens abaixo são exemplos locais. O chat não envia nem recebe mensagens reais.</small></span>
      </div>
      <div className="chat-layout">
        <aside className="chat-contacts">
          <div className="chat-contacts-heading"><strong>Vínculos disponíveis</strong><span>{contacts.length}</span></div>
          {contacts.length ? contacts.map((contact) => (
            <button
              className={`chat-contact ${contact.id === activeId ? "is-selected" : ""}`}
              key={contact.id}
              onClick={() => selectContact(contact.id)}
            >
              <span className="chat-avatar">{role === "aluno" ? "P" : "A"}</span>
              <span><strong>{contact.title}</strong><small>{contact.preview}</small></span>
            </button>
          )) : <p className="chat-empty">Nenhum vínculo de orientação disponível.</p>}
          <p className="chat-privacy">A lista respeita os vínculos de grupo e orientação do perfil atual.</p>
        </aside>
        <section className="chat-window">
          {activeContact ? (
            <>
              <header className="chat-window-header">
                <span className="chat-avatar">{role === "aluno" ? "P" : "A"}</span>
                <span><strong>{activeContact.title}</strong><small>{activeContact.subtitle}</small></span>
                <span className="local-message-tag">EXEMPLO</span>
              </header>
              <div className="chat-messages">
                <div className="chat-date-divider"><span>Conversa de demonstração</span></div>
                {messages.map((message, index) => {
                  const mine = role === "aluno"
                    ? message.sender === "aluno"
                    : message.sender === "professor";
                  return (
                    <div className={`message-row ${mine ? "message-mine" : ""}`} key={`${message.time}-${index}`}>
                      <div className="message-bubble">
                        <p>{message.text}</p>
                        <time>{message.time}</time>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="chat-composer-disabled">
                <input disabled placeholder="Envio de mensagens disponível em uma etapa futura" />
                <button disabled aria-label="Envio indisponível"><MessageCircle size={17} /></button>
              </div>
            </>
          ) : (
            <EmptyState title="Conversa indisponível" text="É necessário haver uma orientação vinculada para demonstrar o fluxo." />
          )}
        </section>
      </div>
    </>
  );
}
