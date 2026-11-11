import { Check, LockKeyhole, Pencil, Trash2, X } from "lucide-react";
import { ACCOUNT_PASSWORD_FIELDS, COLLECTION_CONFIG, FIELD_LABELS, filterCollection, formatValue, getDetailFields, matchesId, STATUS_LABELS } from "./portal-data";
import { editableFields } from "./portal-records";
import { SafeExternalLink } from "./PortalShared";

export function EntityForm({
  role, user, collection, record, data, editing, formError, onChange, onClose, onSave,
}) {
  const config = COLLECTION_CONFIG[collection];
  const key = config.key;
  const accountPasswordField = !editing && role === "administrador" ? ACCOUNT_PASSWORD_FIELDS[collection] : "";
  
  const adminCreateFields = {
    cursos: ["nome", "quantAlunos", "periodo", "codEtec"],
    professores: ["rmProfessor", "nome"],
    alunos: ["rmAluno", "nome", "turma", "idCurso"],
  };

  const isProfessorCreatingGroup = role === "professor" && collection === "grupos" && !editing;

  const allowedFields = editing
    ? editableFields(role, collection, config)
    : role === "administrador"
      ? [...editableFields(role, collection, config), accountPasswordField]
      : isProfessorCreatingGroup
        ? ["nomeGrupo", "idCurso", "turma", "ano", "capacidadeMaxima"]
        : collection === "tccs"
          ? ["codTCC", "idGrupo", "tema", "linkSlide", "linkArtigo", "status", "descricao", "linkSite", "dataCriacao"]
          : [];

  const formFields = !editing && role === "administrador" && adminCreateFields[collection]
      ? adminCreateFields[collection]
      : isProfessorCreatingGroup
        ? ["nomeGrupo", "idCurso", "turma", "ano", "capacidadeMaxima"]
        : config.fields;

  const fields = [...formFields, accountPasswordField].filter(Boolean).filter(
    (field) => allowedFields.includes(field) || (!editing && field === key && role === "administrador"),
  );

  const getFieldType = (field) => {
    if (field === "senha" || field === "senhaAdmin") return "password";
    if (field === "codEtec" && collection === "cursos") return "select";
    if (field === "idCurso" && ["alunos", "orientacoes"].includes(collection)) return "select";
    if (field === "idCurso" && isProfessorCreatingGroup) return "select";
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
    if (field === "codEtec") return data.etecs.map((item) => [String(item.codEtec), item.nome]);

    // Para o professor criando grupo: lista todos os cursos
    if (field === "idCurso" && isProfessorCreatingGroup) {
      // Se data.cursos estiver vazio, o select fica vazio. É preciso que o getPortalData traga os cursos.
      return (data.cursos || []).map((item) => [String(item.idCurso || item.id), item.nome]);
    }

    if (field === "idCurso") return (data.cursos || []).map((item) => [String(item.idCurso || item.id), item.nome]);

    if (field === "idGrupo") {
      const availableGroups = role === "aluno"
        ? data.grupos.filter((item) => item.idGrupo === Number(user?.idGrupo))
        : role === "professor"
          ? filterCollection(role, user, data, "grupos").filter((group) => !data.tccs.some((item) => item.idGrupo === group.idGrupo && item.codTCC !== record.codTCC))
          : data.grupos;
      return availableGroups.map((item) => [String(item.idGrupo), item.nomeGrupo]);
    }

    if (field === "idOrientacao") {
      if (role === "professor") {
        const orientacoesSemGrupo = data.orientacoes.filter((o) => 
          matchesId(o.rmProfessor, user?.rmProfessor) && 
          !data.grupos.some((g) => matchesId(g.idOrientacao, o.idOrientacao))
        );
        return orientacoesSemGrupo.map((item) => [
          String(item.idOrientacao),
          `Curso ${item.idCurso} · Turma ${item.turma} (Orientação #${item.idOrientacao})`
        ]);
      }
      return data.orientacoes.map((item) => [String(item.idOrientacao), `RM ${item.rmProfessor} · Curso ${item.idCurso} · Turma ${item.turma}`]);
    }

    if (field === "turma") {
      if (isProfessorCreatingGroup) {
        const minhasOrientacoes = (data.orientacoes || []).filter(
          (o) => matchesId(o.rmProfessor, user?.rmProfessor)
        );
        const turmasJaOrientadas = minhasOrientacoes.map((o) => o.turma);
        return [["A", "Turma A"], ["B", "Turma B"]].filter(
          ([val]) => !turmasJaOrientadas.includes(val)
        );
      }
      return [["A", "Turma A"], ["B", "Turma B"]];
    }

    if (field === "rmProfessor") return data.professores.map((item) => [String(item.rmProfessor), `RM ${item.rmProfessor} · ${item.email}`]);
    if (field === "periodo") return [["Manhã", "Manhã"], ["Tarde", "Tarde"], ["Noite", "Noite"]];
    if (field === "status") return Object.entries(STATUS_LABELS);
    return [];
  };

  const alunosDisponiveis = isProfessorCreatingGroup && record.idCurso && record.turma
    ? (data.alunos || []).filter((aluno) => 
        matchesId(aluno.idCurso, record.idCurso) && 
        aluno.turma === record.turma &&
        (aluno.idGrupo == null || aluno.idGrupo === "")
      )
    : [];

  const quantidadeAlunos = Math.max(0, Number(record.quantidadeAlunos) || 0);
  const alunosSelecionados = Array.isArray(record.alunosSelecionados) ? record.alunosSelecionados : [];

  const handleQuantidadeChange = (event) => {
    const bruto = Number(event.target.value) || 0;
    const limite = Math.max(0, alunosDisponiveis.length);
    const qtd = Math.min(Math.max(0, bruto), limite);
    const proximos = Array.from({ length: qtd }, (_, i) => alunosSelecionados[i] ?? "");
    onChange("quantidadeAlunos", qtd);
    onChange("alunosSelecionados", proximos);
  };

  const handleAlunoChange = (index, value) => {
    const proximos = [...alunosSelecionados];
    proximos[index] = value;
    onChange("alunosSelecionados", proximos);
  };

  const turmasDisponiveis = choicesFor("turma");
  const cursosDisponiveis = choicesFor("idCurso");

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
            ? "Preencha os atributos do MER."
            : isProfessorCreatingGroup
              ? "Escolha o curso e a turma. O sistema criará a orientação automaticamente e vinculará os alunos."
              : "Você pode alterar somente os dados permitidos para o seu perfil e seus vínculos."}
        </p>
        <form onSubmit={onSave}>
          <div className="form-grid">
            {fields.map((field) => {
              const type = getFieldType(field);
              const choices = choicesFor(field);
              const value = record[field] != null ? String(record[field]) : "";
              const isKey = field === key;
              const isLockedKey = (editing && isKey) || (!editing && isKey && role !== "administrador");
              const isDisabled = isLockedKey;

              return (
                <label className="form-field" key={field}>
                  <span>{FIELD_LABELS[field]}{isKey ? " · chave" : ""}</span>
                  {type === "select" ? (
                    <select
                      value={value}
                      disabled={isDisabled}
                      required={!editing}
                      onChange={(event) => {
                        const isNumberField = ["idCurso", "idGrupo", "idOrientacao"].includes(field);
                        const nextValue = isNumberField 
                          ? (event.target.value === "" ? "" : Number(event.target.value)) 
                          : event.target.value;
                        
                        onChange(field, nextValue);
                        
                        if (field === "idOrientacao" || field === "idCurso" || field === "turma") {
                          onChange("quantidadeAlunos", 0);
                          onChange("alunosSelecionados", []);
                        }
                      }}
                    >
                      <option value="">Selecione</option>
                      {choices.map(([optionValue, label]) => (
                        <option key={optionValue} value={optionValue}>{label}</option>
                      ))}
                    </select>
                  ) : type === "textarea" ? (
                    <textarea value={value} disabled={isDisabled} required={!["descricao"].includes(field)} rows={field === "descricao" ? 4 : 2} onChange={(event) => onChange(field, event.target.value)} />
                  ) : (
                    <input
                      type={type}
                      value={value}
                      disabled={isDisabled}
                      required={!editing && !["linkFoto", "linkSlide", "linkArtigo", "linkSite", "descricao"].includes(field)}
                      min={field === "capacidadeMaxima" ? "1" : type === "number" ? "0" : undefined}
                      step={type === "number" ? "1" : undefined}
                      onChange={(event) => onChange(field, type === "number" && event.target.value !== "" ? Number(event.target.value) : event.target.value)}
                    />
                  )}
                </label>
              );
            })}

            {isProfessorCreatingGroup && cursosDisponiveis.length === 0 && (
              <div className="form-error" role="status" style={{ gridColumn: "1 / -1", background: "rgba(255, 100, 100, 0.1)", color: "#ff6464", padding: "10px", borderRadius: "5px" }}>
                Nenhum curso encontrado. Verifique se o backend está enviando a lista de cursos para o professor.
              </div>
            )}

            {isProfessorCreatingGroup && record.idCurso && record.turma && (
              <>
                <label className="form-field">
                  <span>Quantidade de alunos (máx: {alunosDisponiveis.length})</span>
                  <input
                    type="number"
                    min={0}
                    max={alunosDisponiveis.length}
                    step={1}
                    value={quantidadeAlunos}
                    onChange={handleQuantidadeChange}
                    required
                  />
                </label>

                {Array.from({ length: quantidadeAlunos }).map((_, index) => {
                  const valorAtual = alunosSelecionados[index] ?? "";
                  const usados = new Set(alunosSelecionados.filter((_, i) => i !== index));
                  return (
                    <label className="form-field" key={`aluno-${index}`}>
                      <span>Aluno {index + 1}</span>
                      <select value={valorAtual} required onChange={(event) => handleAlunoChange(index, event.target.value)}>
                        <option value="">Selecione um aluno</option>
                        {alunosDisponiveis.map((aluno) => (
                          <option key={aluno.rmAluno} value={aluno.rmAluno} disabled={usados.has(aluno.rmAluno)}>
                            {aluno.nomeAluno || aluno.nome} (RM {aluno.rmAluno})
                          </option>
                        ))}
                      </select>
                    </label>
                  );
                })}

                {alunosDisponiveis.length === 0 && (
                  <div className="form-error" role="status" style={{ gridColumn: "1 / -1" }}>
                    Nenhum aluno disponível para este curso/turma. Verifique se há alunos cadastrados e sem grupo.
                  </div>
                )}
              </>
            )}

            {isProfessorCreatingGroup && turmasDisponiveis.length === 0 && (
              <div className="form-error" role="status" style={{ gridColumn: "1 / -1", background: "rgba(255, 100, 100, 0.1)", color: "#ff6464", padding: "10px", borderRadius: "5px" }}>
                Você já está orientando todas as turmas disponíveis neste momento. Finalize ou exclua uma orientação/grupo antes de criar outro.
              </div>
            )}
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
  const title = record.tema || record.nomeGrupo || record.nome || record.email || record.userAdmin || `Registro ${record[config.key]}`;
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
              <dd>{field.startsWith("link") && record[field] ? <SafeExternalLink href={record[field]} /> : formatValue(collection, field, record[field], data)}</dd>
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