import { Check, LockKeyhole, Pencil, Trash2, X } from "lucide-react";
import { ACCOUNT_PASSWORD_FIELDS, COLLECTION_CONFIG, FIELD_LABELS, filterCollection, formatValue, getDetailFields, STATUS_LABELS } from "./portal-data";
import { editableFields } from "./portal-records";
import { SafeExternalLink } from "./PortalShared";

export function EntityForm({
  role,
  user,
  collection,
  record,
  data,
  editing,
  formError,
  onChange,
  onClose,
  onSave,
}) {
  const config = COLLECTION_CONFIG[collection];
  const key = config.key;
  const accountPasswordField =
    !editing && role === "administrador"
      ? ACCOUNT_PASSWORD_FIELDS[collection]
      : "";
  const adminCreateFields = {
    cursos: ["nome", "quantAlunos", "periodo", "codEtec"],
    professores: ["rmProfessor", "nome"],
    alunos: ["rmAluno", "nome", "turma", "idCurso"],
  };
  const allowedFields = editing
    ? editableFields(role, collection, config)
    : role === "administrador"
      ? [...editableFields(role, collection, config), accountPasswordField]
      : collection === "tccs"
        ? ["codTCC", "idGrupo", "tema", "linkSlide", "linkArtigo", "status", "descricao", "linkSite", "dataCriacao"]
        : [];
  const formFields =
    !editing && role === "administrador" && adminCreateFields[collection]
      ? adminCreateFields[collection]
      : config.fields;
  const fields = [...formFields, accountPasswordField].filter(Boolean).filter(
    (field) =>
      allowedFields.includes(field) ||
      (!editing && field === key && role === "administrador"),
  );

  const getFieldType = (field) => {
    if (field === "senha" || field === "senhaAdmin") return "password";
    if (field === "codEtec" && collection === "cursos") return "select";
    if (field === "idCurso" && ["alunos", "orientacoes"].includes(collection)) return "select";
    if (field === "idGrupo" && ["alunos", "tccs"].includes(collection)) return "select";
    if (field === "idOrientacao" && collection === "grupos") return "select";
    if (field === "rmProfessor" && collection === "orientacoes") return "select";
    if (field === "turma" || field === "periodo" || field === "status") return "select";
    if (["descricao", "tema"].includes(field)) return "textarea";
    if (["idAdmin", "idCurso", "quantAlunos", "idOrientacao", "idGrupo", "ano", "capacidadeMaxima"].includes(field)) return "number";
    if (field.startsWith("link")) return "url";
    if (field === "email") return "email";
    if (field === "dataCriacao") return "date";
    return "text";
  };

  const choicesFor = (field) => {
    if (field === "codEtec") return data.etecs.map((item) => [item.codEtec, item.nome]);
    if (field === "idCurso") return data.cursos.map((item) => [item.idCurso, item.nome]);
    if (field === "idGrupo") {
      const availableGroups = role === "aluno"
        ? data.grupos.filter((item) => item.idGrupo === Number(user?.idGrupo))
        : role === "professor"
          ? filterCollection(role, user, data, "grupos").filter(
              (group) =>
                !data.tccs.some(
                  (item) =>
                    item.idGrupo === group.idGrupo &&
                    item.codTCC !== record.codTCC,
                ),
            )
          : data.grupos;
      return availableGroups.map((item) => [item.idGrupo, item.nomeGrupo]);
    }
    if (field === "idOrientacao") {
      return data.orientacoes.map((item) => [
        item.idOrientacao,
        `RM ${item.rmProfessor} · Curso ${item.idCurso} · Turma ${item.turma}`,
      ]);
    }
    if (field === "rmProfessor") return data.professores.map((item) => [item.rmProfessor, `RM ${item.rmProfessor} · ${item.email}`]);
    if (field === "turma") return [["A", "Turma A"], ["B", "Turma B"]];
    if (field === "periodo") return [["Manhã", "Manhã"], ["Tarde", "Tarde"], ["Noite", "Noite"]];
    if (field === "status") return Object.entries(STATUS_LABELS);
    return [];
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="entity-modal" role="dialog" aria-modal="true" aria-labelledby="entity-form-title">
        <div className="modal-heading">
          <div>
            <span className="eyebrow">{editing ? "ATUALIZAÇÃO" : "NOVO CADASTRO"}</span>
            <h2 id="entity-form-title">{editing ? "Editar" : "Cadastrar"} {config.singular}</h2>
          </div>
          <button className="icon-action" onClick={onClose} aria-label="Fechar"><X size={19} /></button>
        </div>
        <p className="form-intro">
          {role === "administrador"
            ? "Preencha os atributos do MER. A senha inicial é enviada somente ao servidor e nunca é exibida depois."
            : "Você pode alterar somente os dados permitidos para o seu perfil e seus vínculos."}
        </p>
        <form onSubmit={onSave}>
          <div className="form-grid">
            {fields.map((field) => {
              const type = getFieldType(field);
              const choices = choicesFor(field);
              const value = record[field] ?? "";
              const isKey = field === key;
              const isLockedKey =
                (editing && isKey) ||
                (!editing && isKey && role !== "administrador");
              const isLockedStudentGroup =
                role === "aluno" && collection === "tccs" && field === "idGrupo";
              const isLockedOwner =
                role === "professor" &&
                collection === "orientacoes" &&
                field === "rmProfessor";
              const isDisabled =
                isLockedKey || isLockedOwner || isLockedStudentGroup;
              return (
                <label className="form-field" key={field}>
                  <span>{FIELD_LABELS[field]}{isKey ? " · chave" : ""}</span>
                  {type === "select" ? (
                    <select
                      value={value}
                      disabled={isDisabled}
                      required
                      onChange={(event) => {
                        const nextValue = ["idCurso", "idGrupo", "idOrientacao"].includes(field)
                          ? Number(event.target.value)
                          : event.target.value;
                        onChange(field, nextValue);
                      }}
                    >
                      <option value="">Selecione</option>
                      {choices.map(([optionValue, label]) => (
                        <option key={optionValue} value={optionValue}>{label}</option>
                      ))}
                    </select>
                  ) : type === "textarea" ? (
                    <textarea
                      value={value}
                      disabled={isDisabled}
                      required={!["descricao"].includes(field)}
                      rows={field === "descricao" ? 4 : 2}
                      onChange={(event) => onChange(field, event.target.value)}
                    />
                  ) : (
                    <input
                      type={type}
                      value={value}
                      disabled={isDisabled}
                      required={!["linkFoto", "linkSlide", "linkArtigo", "linkSite", "descricao"].includes(field)}
                      min={type === "number" ? "0" : undefined}
                      step={type === "number" ? "1" : undefined}
                      onChange={(event) =>
                        onChange(
                          field,
                          type === "number" && event.target.value !== ""
                            ? Number(event.target.value)
                            : event.target.value,
                        )
                      }
                    />
                  )}
                </label>
              );
            })}
          </div>
          {formError && <div className="form-error" role="alert">{formError}</div>}
          <div className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="button button-primary"><Check size={16} /> Salvar alterações</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export function DetailDialog({ role, collection, record, data, onClose, onEdit, onDelete }) {
  const config = COLLECTION_CONFIG[collection];
  const fields = getDetailFields(role, collection, config);
  const title =
    record.tema ||
    record.nomeGrupo ||
    record.nome ||
    record.email ||
    record.userAdmin ||
    `Registro ${record[config.key]}`;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="entity-modal detail-modal" role="dialog" aria-modal="true" aria-labelledby="entity-detail-title">
        <div className="modal-heading">
          <div><span className="eyebrow">{config.label.toUpperCase()}</span><h2 id="entity-detail-title">{title}</h2></div>
          <button className="icon-action" onClick={onClose} aria-label="Fechar"><X size={19} /></button>
        </div>
        <dl className="detail-grid">
          {fields.map((field) => (
            <div className={`detail-field ${field === "descricao" ? "detail-wide" : ""}`} key={field}>
              <dt>{FIELD_LABELS[field]}</dt>
              <dd>
                {field.startsWith("link") && record[field]
                  ? <SafeExternalLink href={record[field]} />
                  : formatValue(collection, field, record[field], data)}
              </dd>
            </div>
          ))}
        </dl>
        {role === "visitante" && collection === "tccs" && (
          <div className="public-data-note"><LockKeyhole size={15} /> A visualização pública não inclui dados pessoais nem relações privadas.</div>
        )}
        <div className="modal-actions">
          {onDelete && <button className="button button-danger" onClick={onDelete}><Trash2 size={15} /> Excluir</button>}
          <span className="actions-spacer" />
          <button className="button button-secondary" onClick={onClose}>Fechar</button>
          {onEdit && <button className="button button-primary" onClick={onEdit}><Pencil size={15} /> Editar</button>}
        </div>
      </section>
    </div>
  );
}
