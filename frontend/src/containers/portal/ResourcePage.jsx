import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Eye, FileText, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { COLLECTION_CONFIG, FIELD_LABELS, formatValue, ROLE_LABELS, STATUS_LABELS } from "./portal-data";
import { canCreate, canEdit } from "./portal-records";
import { DetailCard, EmptyState, GroupCards, PageHeading, PublicCourseCards } from "./PortalShared";

export function ResourcePage({
  role,
  user,
  data,
  collection,
  rows,
  onEdit,
  onCreate,
  onDetail,
  onDelete,
  search,
  detailOnly = false,
}) {
  const config = COLLECTION_CONFIG[collection];
  const columns =
    role === "visitante" && collection === "tccs"
      ? ["tema", "status", "dataCriacao"]
      : config.columns;
  const ownRows = useMemo(() => {
    const value = search.trim().toLocaleLowerCase("pt-BR");
    if (!value) return rows;
    return rows.filter((record) =>
      config.fields.some((field) =>
        String(record[field] ?? "").toLocaleLowerCase("pt-BR").includes(value),
      ),
    );
  }, [config.fields, rows, search]);
  const canAdd = !detailOnly && canCreate(role, collection, data, user);
  const detailRecord = detailOnly ? rows[0] : null;
  const description =
    role === "visitante" && collection === "tccs"
      ? "Acervo público: somente trabalhos aprovados ou publicados."
      : role === "aluno"
        ? "Somente registros do seu próprio vínculo aparecem nesta área."
        : role === "professor"
          ? "Somente dados relacionados às suas próprias orientações aparecem nesta área."
          : "Cadastros alinhados às entidades e aos atributos do MER.";

  if (detailOnly && detailRecord) {
    return (
      <>
        <PageHeading
          eyebrow="DETALHES"
          title={detailRecord.tema || detailRecord.nome || detailRecord.nomeGrupo || `Registro ${detailRecord[config.key]}`}
          description={description}
          action={<Link className="button button-secondary" to={`/${collection}`}>Voltar à lista</Link>}
        />
        <DetailCard
          role={role}
          collection={collection}
          record={detailRecord}
          data={data}
          onEdit={
            canEdit(role, collection, detailRecord, user, data)
              ? () => onEdit(detailRecord)
              : undefined
          }
        />
      </>
    );
  }

  if (role === "visitante" && collection === "cursos") {
    return (
      <>
        <PageHeading
          eyebrow="EXPLORE POR FORMAÇÃO"
          title="Cursos"
          description="Escolha um curso para consultar seus TCCs públicos."
        />
        <PublicCourseCards courses={ownRows} data={data} />
      </>
    );
  }

  if (role === "professor" && collection === "grupos") {
    return (
      <>
        <PageHeading
          eyebrow="ACOMPANHAMENTO"
          title="Meus grupos"
          description="Crie grupos e acompanhe o TCC e as conversas dentro de cada espaço."
          action={
            canAdd ? (
              <button className="button button-primary" onClick={onCreate}>
                <Plus size={17} /> Novo grupo
              </button>
            ) : undefined
          }
        />
        <GroupCards data={data} groups={ownRows} />
      </>
    );
  }

  return (
    <>
      <PageHeading
        eyebrow={role === "administrador" ? "GESTÃO DE CADASTROS" : ROLE_LABELS[role].toUpperCase()}
        title={
          role !== "administrador" && ["alunos", "professores"].includes(collection)
            ? "Meu perfil"
            : config.label
        }
        description={description}
        action={
          canAdd ? (
            <button className="button button-primary" onClick={onCreate}>
              <Plus size={17} /> Novo {config.singular}
            </button>
          ) : undefined
        }
      />
      {collection === "tccs" && role === "visitante" && (
        <div className="public-access-note"><Eye size={17} /> Projetos em andamento e dados privados não são exibidos nesta área.</div>
      )}
      {ownRows.length && role === "administrador" ? (
        <div className="admin-record-grid">
          {ownRows.map((record) => {
            const title =
              record.nome ||
              record.nomeGrupo ||
              record.tema ||
              record.userAdmin ||
              `Registro ${record[config.key]}`;
            return (
              <article className="admin-record-card" key={record[config.key]}>
                <div className="admin-record-card-heading">
                  <span className="admin-record-icon"><FileText size={18} /></span>
                  <span className="admin-record-key">{FIELD_LABELS[config.key]} · {record[config.key]}</span>
                </div>
                <h2>{title}</h2>
                <dl>
                  {columns.filter((field) => field !== config.key).map((field) => (
                    <div key={field}>
                      <dt>{FIELD_LABELS[field]}</dt>
                      <dd>{formatValue(collection, field, record[field], data)}</dd>
                    </div>
                  ))}
                </dl>
                <div className="admin-record-actions">
                  <button className="button button-secondary" onClick={() => onDetail(record)}>
                    <Eye size={15} /> Detalhes
                  </button>
                  <button className="button button-primary" onClick={() => onEdit(record)}>
                    <Pencil size={15} /> Editar
                  </button>
                  {onDelete && (
                    <button className="button button-danger" onClick={() => onDelete(record)}>
                      <Trash2 size={15} /> Excluir
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : ownRows.length ? (
        <div className="table-panel">
          <div className="table-panel-heading">
            <div><strong>{ownRows.length} registro(s)</strong><span>{config.label} conforme as permissões do perfil</span></div>
            <span className="table-mer-mark"><ShieldCheck size={15} /> Modelo MER</span>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {columns.map((field) => <th key={field}>{FIELD_LABELS[field]}</th>)}
                  <th className="actions-heading">Ações</th>
                </tr>
              </thead>
              <tbody>
                {ownRows.map((record) => {
                  const mayEdit = canEdit(role, collection, record, user, data);
                  return (
                    <tr key={record[config.key]}>
                      {columns.map((field) => (
                        <td key={field}>
                          {field === "status" ? (
                            <span className={`status-pill status-${record.status.toLowerCase()}`}>
                              {STATUS_LABELS[record.status]}
                            </span>
                          ) : (
                            <span className={field === "tema" ? "cell-primary" : ""}>
                              {formatValue(collection, field, record[field], data)}
                            </span>
                          )}
                        </td>
                      ))}
                      <td>
                        <div className="table-actions">
                          <button className="icon-action" onClick={() => onDetail(record)} aria-label="Ver detalhes" title="Ver detalhes">
                            <Eye size={16} />
                          </button>
                          {mayEdit && (
                            <button className="icon-action" onClick={() => onEdit(record)} aria-label="Editar registro" title="Editar">
                              <Pencil size={16} />
                            </button>
                          )}
                          {role === "administrador" && onDelete && (
                            <button className="icon-action icon-danger" onClick={() => onDelete(record)} aria-label="Excluir registro" title="Excluir">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title={search ? "Nenhum resultado para esta busca" : "Nenhum registro disponível"}
          text={search ? "Experimente buscar por outro termo." : description}
          action={canAdd ? <button className="button button-primary" onClick={onCreate}><Plus size={17} /> Cadastrar primeiro registro</button> : undefined}
        />
      )}
    </>
  );
}
