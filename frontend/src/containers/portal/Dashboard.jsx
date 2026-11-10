import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Building2, CalendarDays, Check, ClipboardList, FileText, GraduationCap, ShieldCheck, UsersRound } from "lucide-react";
import { COLLECTION_CONFIG, ICONS, orientationSummary, STATUS_LABELS, filterCollection } from "./portal-data";
import { GroupCards, Milestone, PageHeading, PublicTccCards, StatCard } from "./PortalShared";

export function Dashboard({ role, user, data }) {
  const studentGroup = role === "aluno"
    ? data.grupos.find((item) => item.idGrupo === Number(user?.idGrupo))
    : null;
  const studentTcc = studentGroup
    ? data.tccs.find((item) => item.idGrupo === studentGroup.idGrupo)
    : null;
  const publicTccs = data.tccs.filter((item) =>
    ["APROVADO", "PUBLICADO"].includes(item.status),
  );
  const teacherGroups = role === "professor"
    ? filterCollection(role, user, data, "grupos")
    : [];

  if (role === "visitante") {
    return (
      <>
        <section className="public-hero">
          <div className="public-hero-copy">
            <span className="eyebrow">BEEHUB · COMUNIDADE ACADÊMICA</span>
            <h1>Ideias acadêmicas que conectam pessoas e conhecimento.</h1>
            <p>
              Explore cursos e trabalhos aprovados ou publicados. Informações pessoais e projetos em andamento permanecem restritos.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/tccs">
                Conhecer TCCs <ArrowRight size={17} />
              </Link>
              <Link className="button button-secondary" to="/cursos">Explorar cursos</Link>
            </div>
          </div>
          <div className="hero-illustration" aria-hidden="true">
            <div className="hero-illustration-halo" />
            <div className="hero-book"><BookOpen size={54} strokeWidth={1.4} /></div>
            <span className="hero-float hero-float-one"><GraduationCap size={24} /></span>
            <span className="hero-float hero-float-two"><FileText size={22} /></span>
            <span className="hero-dot hero-dot-one" />
            <span className="hero-dot hero-dot-two" />
          </div>
        </section>
        <div className="stats-grid public-stats">
          <StatCard icon={BookOpen} label="Cursos disponíveis" value={data.cursos.length} tone="purple" />
          <StatCard icon={FileText} label="TCCs aprovados ou publicados" value={publicTccs.length} tone="gold" />
          <StatCard icon={Building2} label="ETECs participantes" value={data.etecs.length} tone="green" />
        </div>
        <PageHeading
          eyebrow="ACERVO PÚBLICO"
          title="Trabalhos em destaque"
          description="Somente TCCs aprovados ou publicados são exibidos para visitantes."
          action={<Link className="text-link" to="/tccs">Ver acervo <ArrowRight size={16} /></Link>}
        />
        <PublicTccCards data={data} tccs={publicTccs.slice(0, 3)} />
      </>
    );
  }

  if (role === "aluno") {
    return (
      <>
        <section className="welcome-banner">
          <div>
            <span className="eyebrow">SEU ESPAÇO ACADÊMICO</span>
            <h1>Olá, estudante <span>RM {user?.rmAluno}</span></h1>
            <p>Acompanhe seu grupo, seu trabalho e as orientações vinculadas ao seu curso.</p>
          </div>
          <div className="banner-mark"><GraduationCap size={42} /></div>
        </section>
        <div className="stats-grid">
          <StatCard icon={UsersRound} label="Meu grupo" value={studentGroup?.nomeGrupo || "Não vinculado"} tone="purple" />
          <StatCard icon={FileText} label="Status do TCC" value={STATUS_LABELS[studentTcc?.status] || "Sem TCC"} tone="gold" />
          <StatCard icon={BookOpen} label="Meu curso" value={data.cursos.find((item) => item.idCurso === Number(user?.idCurso))?.nome || "—"} tone="green" />
        </div>
        <section className="content-panel progress-panel">
          <div className="panel-heading">
            <div><span className="eyebrow">PRÓXIMOS PASSOS</span><h2>Seu acompanhamento</h2></div>
            <span className="soft-pill"><Check size={14} /> Dados do seu vínculo</span>
          </div>
          <div className="milestone-list">
            <Milestone title="Vínculo com o grupo" detail={studentGroup?.nomeGrupo || "Nenhum grupo associado"} complete={Boolean(studentGroup)} />
            <Milestone title="Orientação vinculada" detail={orientationSummary(studentGroup, data)} complete={Boolean(studentGroup)} />
            <Milestone title="Trabalho de conclusão" detail={studentTcc?.tema || "Seu grupo ainda não possui TCC cadastrado"} complete={Boolean(studentTcc)} />
          </div>
          <Link className="inline-action" to="/grupos">Ver meu grupo <ArrowRight size={16} /></Link>
        </section>
      </>
    );
  }

  if (role === "professor") {
    const orientedTccs = filterCollection(role, user, data, "tccs");
    const pending = orientedTccs.filter((item) =>
      ["EM_ANDAMENTO", "ENTREGUE"].includes(item.status),
    ).length;
    return (
      <>
        <section className="welcome-banner">
          <div>
            <span className="eyebrow">ÁREA DO PROFESSOR</span>
            <h1>Olá, professor <span>RM {user?.rmProfessor}</span></h1>
            <p>Veja apenas os grupos, as orientações e os TCCs vinculados a você.</p>
          </div>
          <div className="banner-mark"><ClipboardList size={40} /></div>
        </section>
        <div className="stats-grid">
          <StatCard icon={UsersRound} label="Grupos atribuídos" value={teacherGroups.length} tone="purple" />
          <StatCard icon={FileText} label="TCCs vinculados" value={orientedTccs.length} tone="gold" />
          <StatCard icon={CalendarDays} label="Trabalhos em acompanhamento" value={pending} tone="green" />
        </div>
        <PageHeading
          eyebrow="ACOMPANHAMENTO"
          title="Grupos sob sua orientação"
          description="As informações exibidas correspondem somente às suas orientações."
          action={<Link className="text-link" to="/orientacoes">Ver orientações <ArrowRight size={16} /></Link>}
        />
        <GroupCards data={data} groups={teacherGroups} />
      </>
    );
  }

  const overview = Object.entries(COLLECTION_CONFIG)
    .filter(([key]) => key !== "administradores")
    .map(([key, config]) => ({
      id: key,
      label: config.label,
      count: data[key].length,
      icon: ICONS[key],
      path: `/${key}`,
    }));
  return (
    <>
      <section className="welcome-banner admin-banner">
        <div>
          <span className="eyebrow">ADMINISTRAÇÃO DO BEEHUB</span>
          <h1>Visão geral da plataforma</h1>
          <p>Gerencie os cadastros do modelo e acompanhe as relações entre entidades.</p>
        </div>
        <div className="banner-mark"><ShieldCheck size={40} /></div>
      </section>
      <div className="stats-grid">
        <StatCard icon={Building2} label="ETECs" value={data.etecs.length} tone="purple" />
        <StatCard icon={BookOpen} label="Cursos" value={data.cursos.length} tone="gold" />
        <StatCard icon={UsersRound} label="Grupos" value={data.grupos.length} tone="green" />
        <StatCard icon={FileText} label="TCCs" value={data.tccs.length} tone="purple" />
      </div>
      <PageHeading
        eyebrow="CADASTROS DO MODELO"
        title="Entidades e relacionamentos"
        description="Consulte e administre as entidades e os relacionamentos armazenados no servidor."
      />
      <div className="entity-shortcuts">
        {overview.map(({ id, label, count, icon: Icon, path }) => (
          <Link className="entity-shortcut" key={id} to={path}>
            <span className="shortcut-icon"><Icon size={20} /></span>
            <span><strong>{label}</strong><small>{count} registro(s)</small></span>
            <ArrowRight size={17} />
          </Link>
        ))}
      </div>
    </>
  );
}
