import { useEffect, useState } from "react";
import { ArrowLeft, Check, FileText, MessageCircle, Pencil, Send, Trash2, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { updateProfessorGroupTcc, transitionTcc } from "../../services/portalApi";
import { STATUS_LABELS, orientationSummary } from "./portal-data";
import { ConversationPage } from "./ConversationPage";
import { EmptyState, PageHeading, SafeExternalLink } from "./PortalShared";

export function GroupWorkspacePage({
  group,
  data,
  user,
  onEditGroup,
  onDeleteGroup,
  onRefresh,
}) {
  const tcc = data.tccs.find(
    (item) => String(item.idGrupo) === String(group.idGrupo),
  );
  const students = data.alunos.filter(
    (item) => String(item.idGrupo) === String(group.idGrupo),
  );
  const orientation = data.orientacoes.find(
    (item) => String(item.idOrientacao) === String(group.idOrientacao),
  );
  const courseName = data.cursos.find(
    (item) => String(item.idCurso) === String(orientation?.idCurso),
  )?.nome || "—";
  const [editingTcc, setEditingTcc] = useState(false);
  const [tccDraft, setTccDraft] = useState({});
  const [tccBusy, setTccBusy] = useState(false);
  const [tccError, setTccError] = useState("");

  useEffect(() => {
    setTccDraft({
      descricao: tcc?.descricao ?? "",
      feedbackOrientador: tcc?.feedbackOrientador ?? "",
      linkArtigo: tcc?.linkArtigo ?? "",
      linkSite: tcc?.linkSite ?? "",
      linkSlide: tcc?.linkSlide ?? "",
    });
  }, [tcc]);

  const saveTcc = async (event) => {
    event.preventDefault();
    if (!tcc) return;
    setTccBusy(true);
    setTccError("");
    try {
      await updateProfessorGroupTcc(group.idGrupo, tccDraft);
      setEditingTcc(false);
      await onRefresh();
    } catch (error) {
      setTccError(error instanceof Error ? error.message : "Não foi possível salvar as orientações.");
    } finally {
      setTccBusy(false);
    }
  };

  const updateTccStatus = async (action) => {
    if (!tcc) return;
    setTccBusy(true);
    setTccError("");
    try {
      await transitionTcc(tcc.codTCC, action);
      await onRefresh();
    } catch (error) {
      setTccError(error instanceof Error ? error.message : "Não foi possível atualizar o status do TCC.");
    } finally {
      setTccBusy(false);
    }
  };

  return (
    <>
      <PageHeading
        eyebrow="ACOMPANHAMENTO DO GRUPO"
        title={group.nomeGrupo}
        description="Informações, participantes, TCC e conversas deste grupo."
        action={
          <div className="group-workspace-actions">
            <Link className="button button-secondary" to="/grupos">
              <ArrowLeft size={16} /> Meus grupos
            </Link>
            <button className="button button-secondary" onClick={onEditGroup}>
              <Pencil size={15} /> Editar grupo
            </button>
            {onDeleteGroup && (
              <button className="button button-danger" onClick={onDeleteGroup}>
                <Trash2 size={15} /> Excluir
              </button>
            )}
          </div>
        }
      />

      <section className="group-workspace-card">
        <div className="group-workspace-heading">
          <span className="group-card-icon"><UsersRound size={20} /></span>
          <div>
            <span className="eyebrow">INFORMAÇÕES DO GRUPO</span>
            <h2>{group.nomeGrupo}</h2>
          </div>
        </div>
        <dl className="detail-grid">
          <div className="detail-field">
            <dt>Orientação</dt>
            <dd>{orientationSummary(group, data)}</dd>
          </div>
          <div className="detail-field">
            <dt>Ano letivo</dt>
            <dd>{group.ano}</dd>
          </div>
          <div className="detail-field">
            <dt>Curso</dt>
            <dd>{courseName}</dd>
          </div>
          <div className="detail-field">
            <dt>Integrantes</dt>
            <dd>{students.length} de {group.capacidadeMaxima}</dd>
          </div>
        </dl>
      </section>

      <section className="group-workspace-card">
        <div className="group-workspace-section-heading">
          <div>
            <span className="eyebrow">PARTICIPANTES</span>
            <h2>Alunos do grupo</h2>
          </div>
          <span className="soft-pill">{students.length} integrante(s)</span>
        </div>
        {students.length ? (
          <ul className="group-member-list">
            {students.map((student) => (
              <li key={student.rmAluno}>
                {student.linkFoto
                  ? <img src={student.linkFoto} alt="" />
                  : <span className="group-member-avatar"><UsersRound size={16} /></span>}
                <span><strong>{student.nome || `RM ${student.rmAluno}`}</strong><small>RM {student.rmAluno}</small></span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="group-workspace-empty">Ainda não há alunos vinculados a este grupo.</p>
        )}
      </section>

      <section className="group-workspace-card">
        <div className="group-workspace-section-heading">
          <div>
            <span className="eyebrow">TRABALHO DE CONCLUSÃO</span>
            <h2>Acompanhamento do TCC</h2>
          </div>
          {tcc && (
            <span className={`status-pill status-${String(tcc.status).toLowerCase()}`}>
              {STATUS_LABELS[tcc.status] || tcc.status}
            </span>
          )}
        </div>
        {tcc ? (
          <>
            <div className="group-tcc-detail">
              <span className="group-tcc-icon"><FileText size={19} /></span>
              <div><small>{tcc.codTCC}</small><h3>{tcc.tema}</h3></div>
            </div>
            {!editingTcc ? (
              <>
                <p className="group-tcc-description">{tcc.descricao || "O grupo ainda não adicionou uma descrição."}</p>
                {tcc.feedbackOrientador && (
                  <div className="group-tcc-feedback">
                    <strong>Orientação do professor</strong>
                    <p>{tcc.feedbackOrientador}</p>
                  </div>
                )}
                <div className="group-tcc-links">
                  {[
                    ["linkArtigo", "Artigo"],
                    ["linkSlide", "Apresentação"],
                    ["linkSite", "Site"],
                  ].map(([field, label]) => tcc[field] && (
                    <span key={field}>{label}: <SafeExternalLink href={tcc[field]} /></span>
                  ))}
                  {!tcc.linkArtigo && !tcc.linkSlide && !tcc.linkSite && (
                    <span className="group-workspace-empty">Nenhum arquivo ou link enviado ainda.</span>
                  )}
                </div>
                <div className="group-tcc-actions">
                  <button
                    className="button button-secondary"
                    onClick={() => setEditingTcc(true)}
                    disabled={tccBusy}
                  >
                    <Pencil size={15} /> Orientar conteúdo e arquivos
                  </button>
                  {tcc.status === "ENTREGUE" && (
                    <>
                      <button className="button button-primary" onClick={() => updateTccStatus("aprovar")} disabled={tccBusy}>
                        Aprovar
                      </button>
                      <button className="button button-danger" onClick={() => updateTccStatus("reprovar")} disabled={tccBusy}>
                        Solicitar correção
                      </button>
                    </>
                  )}
                  {tcc.status === "APROVADO" && (
                    <button className="button button-primary" onClick={() => updateTccStatus("publicar")} disabled={tccBusy}>
                      Publicar TCC
                    </button>
                  )}
                </div>
              </>
            ) : (
              <form className="group-tcc-form" onSubmit={saveTcc}>
                <label className="form-field">
                  <span>Orientação ou correção para o grupo</span>
                  <textarea
                    value={tccDraft.feedbackOrientador}
                    rows={5}
                    maxLength={5000}
                    onChange={(event) => setTccDraft({ ...tccDraft, feedbackOrientador: event.target.value })}
                  />
                </label>
                {[
                  ["linkArtigo", "Link do artigo"],
                  ["linkSlide", "Link da apresentação"],
                  ["linkSite", "Link do site"],
                ].map(([field, label]) => (
                  <label className="form-field" key={field}>
                    <span>{label}</span>
                    <input
                      type="url"
                      value={tccDraft[field]}
                      onChange={(event) => setTccDraft({ ...tccDraft, [field]: event.target.value })}
                    />
                  </label>
                ))}
                {tccError && <p className="form-error" role="alert">{tccError}</p>}
                <div className="group-tcc-actions">
                  <button className="button button-secondary" type="button" onClick={() => setEditingTcc(false)} disabled={tccBusy}>
                    Cancelar
                  </button>
                  <button className="button button-primary" type="submit" disabled={tccBusy}>
                    <Check size={15} /> Salvar orientações
                  </button>
                </div>
              </form>
            )}
            {tccError && !editingTcc && <p className="form-error" role="alert">{tccError}</p>}
          </>
        ) : (
          <EmptyState
            title="Este grupo ainda não tem TCC"
            text="Quando um integrante cadastrar o trabalho, o acompanhamento aparecerá aqui."
          />
        )}
      </section>

      <section className="group-workspace-card">
        <div className="group-workspace-section-heading">
          <div>
            <span className="eyebrow">COMUNICAÇÃO</span>
            <h2><MessageCircle size={18} /> Conversas do grupo</h2>
          </div>
          <span className="local-message-tag"><Send size={12} /> DEMONSTRAÇÃO</span>
        </div>
        <ConversationPage
          role="professor"
          user={user}
          data={data}
          groupId={group.idGrupo}
          selected=""
          onSelect={() => {}}
        />
      </section>
    </>
  );
}
