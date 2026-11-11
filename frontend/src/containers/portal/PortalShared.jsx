import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Check, FileText, LockKeyhole, Moon, Pencil, Search, Sun, UserRound, UsersRound } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { COLLECTION_CONFIG, FIELD_LABELS, STATUS_LABELS, formatValue, getDetailFields, getTccCourse } from "./portal-data";

export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "light" ? "escuro" : "claro";
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Ativar tema ${nextTheme}`}
      title={`Ativar tema ${nextTheme}`}
    >
      {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
    </button>
  );
}

export function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <article className="stat-card">
      <span className={`stat-icon tone-${tone}`}><Icon size={19} /></span>
      <span className="stat-copy"><small>{label}</small><strong>{value}</strong></span>
    </article>
  );
}

export function Milestone({ title, detail, complete }) {
  return (
    <div className="milestone">
      <span className={`milestone-check ${complete ? "is-complete" : ""}`}>
        {complete ? <Check size={15} /> : <span />}
      </span>
      <span><strong>{title}</strong><small>{detail}</small></span>
    </div>
  );
}

export function PublicTccCards({ data, tccs }) {
  if (!tccs.length) {
    return <EmptyState title="O acervo está sendo formado" text="Quando houver trabalhos aprovados ou publicados, eles aparecerão aqui." />;
  }
  return (
    <div className="public-work-grid">
      {tccs.map((item) => {
        const course = getTccCourse(item, data);
        return (
          <Link className="public-work-card" to={`/tcc/${encodeURIComponent(item.codTCC)}`} key={item.codTCC}>
            <span className="work-card-icon"><FileText size={20} /></span>
            <span className="work-status">{STATUS_LABELS[item.status]}</span>
            <h3>{item.tema}</h3>
            <p>{item.descricao}</p>
            <span className="work-card-footer">
              {course?.nome || "Curso"} <ArrowRight size={16} />
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function PublicCourseCards({ courses, data }) {
  if (!courses.length) {
    return <EmptyState title="Nenhum curso disponível" text="Os cursos públicos aparecerão aqui quando estiverem cadastrados." />;
  }
  return (
    <>
      <PublicCourseAssociationNotice data={data} />
      <div className="public-course-grid">
        {courses.map((course) => {
          const tccCount = data.tccs.filter(
            (tcc) => getTccCourse(tcc, data)?.idCurso === course.idCurso,
          ).length;
          return (
            <Link
              className="public-course-card"
              to={`/curso/${encodeURIComponent(course.idCurso)}`}
              key={course.idCurso}
            >
              <span className="work-card-icon"><BookOpen size={20} /></span>
              <h3>{course.nome}</h3>
              <p>{formatValue("cursos", "codEtec", course.codEtec, data)}</p>
              <span className="work-card-footer">
                {tccCount} TCC(s) público(s) <ArrowRight size={16} />
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export function PublicCourseAssociationNotice({ data }) {
  const hasUnmappedTcc = data.tccs.some((tcc) => !getTccCourse(tcc, data));
  if (!hasUnmappedTcc) return null;
  return (
    <div className="public-access-note" role="note">
      Alguns TCCs não podem ser associados a um curso. A API deve informar `idCurso` ou `nomeCurso` em cada trabalho público.
    </div>
  );
}

export function PublicCourseTccPage({ course, data, tccs, search }) {
  const searchValue = search.trim().toLocaleLowerCase("pt-BR");
  const visibleTccs = searchValue
    ? tccs.filter((tcc) =>
        [tcc.tema, tcc.descricao].some((value) =>
          String(value ?? "").toLocaleLowerCase("pt-BR").includes(searchValue),
        ),
      )
    : tccs;
  return (
    <>
      <PageHeading
        eyebrow="ACERVO PÚBLICO POR CURSO"
        title={course.nome}
        description="Todos os trabalhos aprovados ou publicados deste curso."
        action={<Link className="button button-secondary" to="/cursos">Voltar aos cursos</Link>}
      />
      <PublicCourseAssociationNotice data={data} />
      <PublicTccCards data={data} tccs={visibleTccs} />
    </>
  );
}

export function GroupCards({ data, groups }) {
  if (!groups.length) {
    return <EmptyState title="Nenhum grupo atribuído" text="Não há grupos vinculados às suas orientações neste momento." />;
  }
  return (
    <div className="group-grid">
      {groups.map((group) => {
        const students = data.alunos.filter((item) => item.idGrupo === group.idGrupo);
        const tcc = data.tccs.find((item) => item.idGrupo === group.idGrupo);
        return (
          <article className="group-card" key={group.idGrupo}>
            <div className="group-card-top">
              <span className="group-card-icon"><UsersRound size={20} /></span>
              <span className="soft-pill">{group.ano}</span>
            </div>
            <h3>{group.nomeGrupo}</h3>
            <p>{orientationSummary(group, data)}</p>
            <div className="group-card-meta">
              <span>{students.length}/{group.capacidadeMaxima} integrantes</span>
              <span>{tcc ? STATUS_LABELS[tcc.status] : "Sem TCC"}</span>
            </div>
            {tcc && <div className="group-tcc-preview"><small>TCC</small><strong>{tcc.tema}</strong></div>}
            <Link className="inline-action" to={`/grupos/${encodeURIComponent(group.idGrupo)}`}>
              Ver acompanhamento <ArrowRight size={15} />
            </Link>
          </article>
        );
      })}
    </div>
  );
}

export function UserProfilePage({ role, record, data, onEdit }) {
  const [photoError, setPhotoError] = useState(false);
  if (!record) {
    return <EmptyState title="Perfil não encontrado" text="Não foi possível carregar as informações do usuário." />;
  }
  const collection = role === "aluno" ? "alunos" : "professores";
  const identifier = role === "aluno" ? record.rmAluno : record.rmProfessor;
  const fields = getDetailFields(role, collection, COLLECTION_CONFIG[collection]);
  return (
    <>
      <PageHeading
        eyebrow="SEUS DADOS"
        title="Meu perfil"
        description="Confira suas informações e dados de perfil."
        action={
          <button className="button button-primary" onClick={onEdit}>
            <Pencil size={16} /> Editar informações
          </button>
        }
      />
      <section className="student-profile-card">
        <div className="student-profile-header">
          {record.linkFoto && !photoError ? (
            <img
              className="student-profile-photo"
              src={record.linkFoto}
              alt={`Foto de ${record.nome || `RM ${identifier}`}`}
              onError={() => setPhotoError(true)}
            />
          ) : (
            <span className="student-profile-photo student-profile-photo-fallback">
              <UserRound size={32} />
            </span>
          )}
          <div>
            <span className="eyebrow">{role === "aluno" ? "ALUNO" : "PROFESSOR"}</span>
            <h2>{record.nome || `RM ${identifier}`}</h2>
            <p>RM {identifier}</p>
          </div>
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
      </section>
    </>
  );
}

export function DetailCard({ role, collection, record, data, onEdit }) {
  const config = COLLECTION_CONFIG[collection];
  const fields = getDetailFields(role, collection, config);
  return (
    <section className="detail-card">
      <div className="detail-card-heading">
        <div className="detail-symbol"><FileText size={22} /></div>
        {onEdit && <button className="button button-secondary" onClick={onEdit}><Pencil size={15} /> Editar</button>}
      </div>
      <dl className="detail-grid">
        {fields.map((field) => (
          <div className={`detail-field ${field === "descricao" ? "detail-wide" : ""}`} key={field}>
            <dt>{FIELD_LABELS[field]}</dt>
            <dd>
              {field.startsWith("link") && record[field] ? (
                <SafeExternalLink href={record[field]} />
              ) : (
                formatValue(collection, field, record[field], data)
              )}
            </dd>
          </div>
        ))}
      </dl>
      {role === "visitante" && collection === "tccs" && (
        <div className="public-data-note"><LockKeyhole size={15} /> Dados pessoais, integrantes e vínculos privados não fazem parte da visualização pública.</div>
      )}
    </section>
  );
}

export function SafeExternalLink({ href }) {
  try {
    const parsed = new URL(href);
    if (!["http:", "https:"].includes(parsed.protocol)) return "Link informado";
    return <a href={parsed.href} target="_blank" rel="noreferrer">Abrir link <ArrowRight size={14} /></a>;
  } catch {
    return "Link informado";
  }
}

export function EmptyState({ title, text, action }) {
  return (
    <section className="empty-state">
      <span className="empty-state-icon"><Search size={21} /></span>
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </section>
  );
}
