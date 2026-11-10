import { useState } from "react";
import { ArrowLeft, FileText, MessageCircle, Plus, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { formatValue } from "./portal-data";
import { DetailCard, EmptyState, PageHeading } from "./PortalShared";
import { ConversationPage } from "./ConversationPage";

export function GroupWorkspace({
  group,
  user,
  data,
  tcc,
  canEditTcc,
  onCreateTcc,
  onEditTcc,
}) {
  const [activeTab, setActiveTab] = useState("tcc");
  if (!group) {
    return (
      <EmptyState
        title="Grupo não encontrado"
        text="O grupo pode não existir ou não estar vinculado às suas orientações."
        action={<Link className="button button-secondary" to="/grupos"><ArrowLeft size={16} /> Voltar aos grupos</Link>}
      />
    );
  }

  const members = data.alunos.filter(
    (student) => String(student.idGrupo) === String(group.idGrupo),
  );
  const tabs = [
    { id: "tcc", label: "TCC", icon: FileText },
    { id: "conversas", label: "Conversas", icon: MessageCircle },
  ];

  return (
    <>
      <PageHeading
        eyebrow="ESPAÇO DO GRUPO"
        title={group.nomeGrupo}
        description={`${members.length} integrante(s) · ${group.ano || "Ano não informado"}`}
        action={<Link className="button button-secondary" to="/grupos"><ArrowLeft size={16} /> Todos os grupos</Link>}
      />

      <section className="content-panel group-workspace-members">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">INTEGRANTES</span>
            <h2><UsersRound size={18} /> {members.length}/{group.capacidadeMaxima || "—"} integrantes</h2>
          </div>
          <span className="soft-pill">{formatValue("grupos", "idOrientacao", group.idOrientacao, data)}</span>
        </div>
        {members.length ? (
          <ul className="group-member-list">
            {members.map((member) => (
              <li key={member.rmAluno}>
                <span className="group-member-avatar">{(member.nome || "A").slice(0, 1).toUpperCase()}</span>
                <span><strong>{member.nome || `RM ${member.rmAluno}`}</strong><small>RM {member.rmAluno}</small></span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="group-workspace-empty">Ainda não há alunos vinculados a este grupo.</p>
        )}
      </section>

      <div className="group-workspace-tabs" role="tablist" aria-label="Conteúdo do grupo">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`group-tab-${id}`}
            className={`group-workspace-tab ${activeTab === id ? "is-active" : ""}`}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`group-panel-${id}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      <section
        id={`group-panel-${activeTab}`}
        className="group-workspace-panel"
        role="tabpanel"
        aria-labelledby={`group-tab-${activeTab}`}
      >
        {activeTab === "tcc" ? (
          tcc ? (
            <DetailCard
              role="professor"
              collection="tccs"
              record={tcc}
              data={data}
              onEdit={canEditTcc ? onEditTcc : undefined}
            />
          ) : (
            <EmptyState
              title="Este grupo ainda não tem TCC"
              text="Cadastre o trabalho para acompanhar seus dados e links por aqui."
              action={
                <button className="button button-primary" type="button" onClick={onCreateTcc}>
                  <Plus size={16} /> Cadastrar TCC
                </button>
              }
            />
          )
        ) : (
          <ConversationPage
            role="professor"
            user={user}
            data={data}
            selected=""
            onSelect={() => {}}
            groupId={group.idGrupo}
            groupName={group.nomeGrupo}
          />
        )}
      </section>
    </>
  );
}
