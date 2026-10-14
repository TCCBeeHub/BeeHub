import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  Eye,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  MessageCircle,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import logo from "../../assets/images/BeeHubHorizontal.jpeg";
import {
  loadDemoData,
  resetDemoData,
  saveDemoData,
} from "../../services/demoApi";
import { useAuth } from "../../context/AuthContext";
import "./portal.css";

const ROLE_LABELS = {
  visitante: "Visitante",
  aluno: "Aluno",
  professor: "Professor",
  administrador: "Administrador",
};

const ROLE_DESCRIPTIONS = {
  visitante: "Acesse os cursos e conheça TCCs aprovados e publicados.",
  aluno: "Acompanhe seu grupo, seu TCC e as orientações vinculadas.",
  professor: "Gerencie somente os grupos e TCCs sob sua orientação.",
  administrador: "Gerencie os cadastros acadêmicos e suas relações.",
};

const NAV_ITEMS = {
  visitante: [
    { id: "home", label: "Início", path: "/", icon: LayoutDashboard },
    { id: "cursos", label: "Cursos", path: "/cursos", icon: BookOpen },
    { id: "tccs", label: "TCCs públicos", path: "/tccs", icon: FileText },
  ],
  aluno: [
    { id: "home", label: "Visão geral", path: "/", icon: LayoutDashboard },
    { id: "grupos", label: "Meu grupo", path: "/grupos", icon: UsersRound },
    { id: "tccs", label: "Meu TCC", path: "/tccs", icon: FileText },
    { id: "conversas", label: "Conversas", path: "/conversas", icon: MessageCircle },
    { id: "perfil", label: "Meu perfil", path: "/perfil", icon: UserRound },
  ],
  professor: [
    { id: "home", label: "Visão geral", path: "/", icon: LayoutDashboard },
    { id: "grupos", label: "Grupos atribuídos", path: "/grupos", icon: UsersRound },
    { id: "orientacoes", label: "Orientações", path: "/orientacoes", icon: ClipboardList },
    { id: "tccs", label: "TCCs orientados", path: "/tccs", icon: FileText },
    { id: "conversas", label: "Conversas", path: "/conversas", icon: MessageCircle },
    { id: "perfil", label: "Meu perfil", path: "/perfil", icon: UserRound },
  ],
  administrador: [
    { id: "home", label: "Visão geral", path: "/", icon: LayoutDashboard },
    { id: "etecs", label: "ETECs", path: "/etecs", icon: Building2 },
    { id: "cursos", label: "Cursos", path: "/cursos", icon: BookOpen },
    { id: "alunos", label: "Alunos", path: "/alunos", icon: GraduationCap },
    { id: "professores", label: "Professores", path: "/professores", icon: UserRound },
    { id: "orientacoes", label: "Orientações", path: "/orientacoes", icon: ClipboardList },
    { id: "grupos", label: "Grupos", path: "/grupos", icon: UsersRound },
    { id: "tccs", label: "TCCs", path: "/tccs", icon: FileText },
    { id: "administradores", label: "Administradores", path: "/administradores", icon: ShieldCheck },
  ],
};

const COLLECTION_CONFIG = {
  administradores: {
    label: "Administradores",
    singular: "administrador",
    key: "idAdmin",
    columns: ["idAdmin", "userAdmin"],
    fields: ["idAdmin", "userAdmin"],
  },
  etecs: {
    label: "ETECs",
    singular: "ETEC",
    key: "codEtec",
    columns: ["codEtec", "nome"],
    fields: ["codEtec", "nome"],
  },
  cursos: {
    label: "Cursos",
    singular: "curso",
    key: "idCurso",
    columns: ["nome", "periodo", "quantAlunos", "codEtec"],
    fields: ["idCurso", "nome", "quantAlunos", "periodo", "codEtec"],
  },
  professores: {
    label: "Professores",
    singular: "professor",
    key: "rmProfessor",
    columns: ["rmProfessor", "email", "descricao"],
    fields: ["rmProfessor", "email", "linkFoto", "descricao"],
  },
  alunos: {
    label: "Alunos",
    singular: "aluno",
    key: "rmAluno",
    columns: ["rmAluno", "email", "idCurso", "idGrupo", "turma"],
    fields: ["rmAluno", "email", "linkFoto", "descricao", "turma", "idCurso", "idGrupo"],
  },
  orientacoes: {
    label: "Orientações",
    singular: "orientação",
    key: "idOrientacao",
    columns: ["idOrientacao", "idCurso", "rmProfessor", "turma"],
    fields: ["idOrientacao", "idCurso", "rmProfessor", "turma"],
  },
  grupos: {
    label: "Grupos",
    singular: "grupo",
    key: "idGrupo",
    columns: ["nomeGrupo", "ano", "idOrientacao", "capacidadeMaxima"],
    fields: ["idGrupo", "nomeGrupo", "idOrientacao", "linkFoto", "ano", "capacidadeMaxima"],
  },
  tccs: {
    label: "Trabalhos de conclusão",
    singular: "TCC",
    key: "codTCC",
    columns: ["tema", "status", "idGrupo", "dataCriacao"],
    fields: ["codTCC", "tema", "linkSlide", "linkArtigo", "status", "idGrupo", "descricao", "linkSite", "dataCriacao"],
  },
};

const FIELD_LABELS = {
  idAdmin: "Identificador",
  userAdmin: "Usuário",
  codEtec: "Código da ETEC",
  nome: "Nome",
  idCurso: "Identificador do curso",
  quantAlunos: "Quantidade de alunos",
  periodo: "Período",
  rmProfessor: "RM do professor",
  rmAluno: "RM do aluno",
  email: "E-mail",
  linkFoto: "Link da foto",
  descricao: "Descrição",
  turma: "Turma",
  idGrupo: "Grupo",
  idOrientacao: "Orientação",
  nomeGrupo: "Nome do grupo",
  ano: "Ano",
  capacidadeMaxima: "Capacidade máxima",
  codTCC: "Código do TCC",
  tema: "Tema",
  linkSlide: "Link dos slides",
  linkArtigo: "Link do artigo",
  status: "Status",
  linkSite: "Link do site",
  dataCriacao: "Data de criação",
};

const STATUS_LABELS = {
  EM_ANDAMENTO: "Em andamento",
  ENTREGUE: "Entregue",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
  PUBLICADO: "Publicado",
};

const EDITABLE_FIELDS = {
  aluno: {
    alunos: ["email", "linkFoto", "descricao", "turma"],
    grupos: ["nomeGrupo", "linkFoto", "ano", "capacidadeMaxima"],
    tccs: ["tema", "linkSlide", "linkArtigo", "status", "descricao", "linkSite"],
  },
  professor: {
    professores: ["email", "linkFoto", "descricao"],
    grupos: ["nomeGrupo", "linkFoto", "ano", "capacidadeMaxima"],
    orientacoes: ["idCurso", "turma"],
    tccs: ["tema", "linkSlide", "linkArtigo", "status", "descricao", "linkSite"],
  },
};

const ICONS = {
  home: LayoutDashboard,
  etecs: Building2,
  cursos: BookOpen,
  alunos: GraduationCap,
  professores: UserRound,
  orientacoes: ClipboardList,
  grupos: UsersRound,
  tccs: FileText,
  administradores: ShieldCheck,
};

const CHAT_MESSAGES = {
  aluno: [
    { sender: "professor", text: "Olá! Vamos revisar os próximos passos do projeto na próxima orientação.", time: "14:20" },
    { sender: "aluno", text: "Combinado. Estou organizando a versão atual do trabalho.", time: "14:32" },
    { sender: "professor", text: "Ótimo. Traga também as dúvidas sobre a metodologia.", time: "14:36" },
  ],
  professor: [
    { sender: "aluno", text: "Professor, já atualizamos a estrutura do TCC.", time: "09:12" },
    { sender: "professor", text: "Obrigado pelo aviso. Vou conferir com vocês na orientação.", time: "09:24" },
  ],
};

function getCollectionForSection(section) {
  return COLLECTION_CONFIG[section] ? section : null;
}

function getSectionFromPath(pathname) {
  if (pathname === "/meu-perfil") return "perfil";
  if (pathname === "/projetos" || pathname === "/revisoes") return "tccs";
  if (pathname.startsWith("/projeto/")) return "tcc-detail";
  if (pathname.startsWith("/tcc/")) return "tcc-detail";
  if (pathname.startsWith("/curso/")) return "curso-detail";
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment || "home";
}

function getPathRecordId(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  return parts[1] ? decodeURIComponent(parts[1]) : "";
}

function findCurrentUser(role, data) {
  if (role === "aluno") {
    const rm = localStorage.getItem("beehub-demo-persona-id");
    return data.alunos.find((item) => item.rmAluno === rm) || data.alunos[0];
  }
  if (role === "professor") {
    const rm = localStorage.getItem("beehub-demo-persona-id");
    return (
      data.professores.find((item) => item.rmProfessor === rm) ||
      data.professores[0]
    );
  }
  if (role === "administrador") return data.administradores[0];
  return null;
}

function filterCollection(role, user, data, collection) {
  const rows = data[collection] || [];
  if (role === "administrador") return rows;
  if (role === "visitante") {
    if (collection === "cursos") return rows;
    if (collection === "tccs") {
      return rows.filter((item) =>
        ["APROVADO", "PUBLICADO"].includes(item.status),
      );
    }
    return [];
  }
  if (role === "aluno") {
    if (!user) return [];
    const ownGroup = data.grupos.find(
      (item) => item.idGrupo === Number(user.idGrupo),
    );
    const ownCourse = data.cursos.find(
      (item) => item.idCurso === Number(user.idCurso),
    );
    if (collection === "alunos") return rows.filter((item) => item.rmAluno === user.rmAluno);
    if (collection === "grupos") return rows.filter((item) => item.idGrupo === ownGroup?.idGrupo);
    if (collection === "tccs") return rows.filter((item) => item.idGrupo === ownGroup?.idGrupo);
    if (collection === "cursos") return rows.filter((item) => item.idCurso === ownCourse?.idCurso);
    return [];
  }
  if (role === "professor") {
    if (!user) return [];
    const orientationIds = new Set(
      data.orientacoes
        .filter((item) => item.rmProfessor === user.rmProfessor)
        .map((item) => item.idOrientacao),
    );
    const groupIds = new Set(
      data.grupos
        .filter((item) => orientationIds.has(item.idOrientacao))
        .map((item) => item.idGrupo),
    );
    if (collection === "professores") return rows.filter((item) => item.rmProfessor === user.rmProfessor);
    if (collection === "orientacoes") return rows.filter((item) => item.rmProfessor === user.rmProfessor);
    if (collection === "grupos") return rows.filter((item) => groupIds.has(item.idGrupo));
    if (collection === "tccs") return rows.filter((item) => groupIds.has(item.idGrupo));
    return [];
  }
  return [];
}

function getBlankRecord(collection, data) {
  const max = (key) =>
    Math.max(0, ...(data[collection] || []).map((item) => Number(item[key]) || 0)) + 1;
  const defaults = {
    administradores: { idAdmin: max("idAdmin"), userAdmin: "", senhaAdmin: "" },
    etecs: { codEtec: "", nome: "" },
    cursos: { idCurso: max("idCurso"), nome: "", quantAlunos: 0, periodo: "", codEtec: "" },
    professores: { rmProfessor: "", senha: "", email: "", linkFoto: "", descricao: "" },
    alunos: {
      rmAluno: "",
      senha: "",
      email: "",
      linkFoto: "",
      descricao: "",
      turma: "A",
      idGrupo: "",
      idCurso: "",
    },
    orientacoes: { idOrientacao: max("idOrientacao"), idCurso: "", rmProfessor: "", turma: "A" },
    grupos: {
      idGrupo: max("idGrupo"),
      nomeGrupo: "",
      idOrientacao: "",
      linkFoto: "",
      ano: new Date().getFullYear(),
      capacidadeMaxima: 5,
    },
    tccs: {
      codTCC: "",
      tema: "",
      linkSlide: "",
      linkArtigo: "",
      status: "EM_ANDAMENTO",
      idGrupo: "",
      descricao: "",
      linkSite: "",
      dataCriacao: new Date().toISOString().slice(0, 10),
    },
  };
  return defaults[collection];
}

function getNextTccCode(data) {
  const usedCodes = new Set(data.tccs.map((item) => item.codTCC));
  let next = data.tccs.length + 1;
  while (
    usedCodes.has(
      `TCC-${new Date().getFullYear()}-${String(next).padStart(3, "0")}`,
    )
  ) {
    next += 1;
  }
  return `TCC-${new Date().getFullYear()}-${String(next).padStart(3, "0")}`;
}

function validateRecord(collection, record, data, editingKey) {
  const config = COLLECTION_CONFIG[collection];
  const key = config.key;
  if (!String(record[key] ?? "").trim()) {
    return `${FIELD_LABELS[key]} é obrigatório.`;
  }
  if (
    data[collection].some(
      (item) =>
        String(item[key]) === String(record[key]) &&
        String(item[key]) !== String(editingKey ?? ""),
    )
  ) {
    return `${FIELD_LABELS[key]} já está cadastrado.`;
  }
  if (record.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) {
    return "Informe um e-mail válido.";
  }
  if (collection === "cursos" && !data.etecs.some((item) => item.codEtec === record.codEtec)) {
    return "Selecione uma ETEC cadastrada.";
  }
  if (
    collection === "orientacoes" &&
    (!data.cursos.some((item) => item.idCurso === Number(record.idCurso)) ||
      !data.professores.some((item) => item.rmProfessor === record.rmProfessor))
  ) {
    return "Selecione um curso e um professor cadastrados.";
  }
  if (
    collection === "grupos" &&
    !data.orientacoes.some(
      (item) => item.idOrientacao === Number(record.idOrientacao),
    )
  ) {
    return "Selecione uma orientação cadastrada.";
  }
  if (collection === "alunos") {
    const group = data.grupos.find(
      (item) => item.idGrupo === Number(record.idGrupo),
    );
    const course = data.cursos.find(
      (item) => item.idCurso === Number(record.idCurso),
    );
    const orientation = data.orientacoes.find(
      (item) => item.idOrientacao === group?.idOrientacao,
    );
    if (!group || !course) return "Selecione um curso e um grupo cadastrados.";
    if (orientation?.idCurso !== course.idCurso) {
      return "O curso do aluno deve corresponder ao curso da orientação do grupo.";
    }
    const groupCount = data.alunos.filter(
      (item) =>
        item.idGrupo === group.idGrupo &&
        item.rmAluno !== editingKey,
    ).length;
    if (groupCount >= Number(group.capacidadeMaxima)) {
      return "O grupo já atingiu sua capacidade máxima.";
    }
  }
  if (collection === "tccs") {
    const groupId = Number(record.idGrupo);
    if (!data.grupos.some((item) => item.idGrupo === groupId)) {
      return "Selecione um grupo cadastrado.";
    }
    if (
      data.tccs.some(
        (item) =>
          item.idGrupo === groupId && item.codTCC !== editingKey,
      )
    ) {
      return "Cada grupo pode possuir apenas um TCC.";
    }
  }
  if (collection === "grupos") {
    const count = data.alunos.filter(
      (item) => item.idGrupo === Number(record.idGrupo),
    ).length;
    if (Number(record.capacidadeMaxima) < count) {
      return `A capacidade não pode ser inferior aos ${count} aluno(s) vinculados.`;
    }
  }
  return "";
}

function canEdit(role, collection, record, user, data) {
  if (role === "administrador") return true;
  if (role === "aluno") {
    if (collection === "alunos") return record.rmAluno === user?.rmAluno;
    if (collection === "grupos") return record.idGrupo === Number(user?.idGrupo);
    if (collection === "tccs") return record.idGrupo === Number(user?.idGrupo);
    return false;
  }
  if (role === "professor") {
    if (collection === "professores") return record.rmProfessor === user?.rmProfessor;
    if (collection === "orientacoes") return record.rmProfessor === user?.rmProfessor;
    if (collection === "grupos" || collection === "tccs") {
      const ownedOrientationIds = new Set(
        data.orientacoes
          .filter((item) => item.rmProfessor === user?.rmProfessor)
          .map((item) => item.idOrientacao),
      );
      return collection === "grupos"
        ? ownedOrientationIds.has(record.idOrientacao)
        : data.grupos.some(
            (group) =>
              group.idGrupo === record.idGrupo &&
              ownedOrientationIds.has(group.idOrientacao),
          );
    }
  }
  return false;
}

function canCreate(role, collection, data, user) {
  if (role === "administrador") return true;
  if (role === "professor" && collection === "orientacoes") return true;
  if (collection !== "tccs" || !["aluno", "professor"].includes(role)) return false;
  const groupIds =
    role === "aluno"
      ? new Set([Number(user?.idGrupo)])
      : new Set(
          data.grupos
            .filter((group) =>
              data.orientacoes.some(
                (item) =>
                  item.idOrientacao === group.idOrientacao &&
                  item.rmProfessor === user?.rmProfessor,
              ),
            )
            .map((group) => group.idGrupo),
        );
  return [...groupIds].some(
    (idGrupo) => !data.tccs.some((item) => item.idGrupo === idGrupo),
  );
}

function editableFields(role, collection, config) {
  if (role === "administrador") {
    return config.fields.filter(
      (field) =>
        !["senha", "senhaAdmin"].includes(field),
    );
  }
  return EDITABLE_FIELDS[role]?.[collection] || [];
}

function formatValue(collection, field, value, data) {
  if (value === null || value === undefined || value === "") return "—";
  if (field === "status") return STATUS_LABELS[value] || value;
  if (field === "idCurso") {
    return data.cursos.find((item) => item.idCurso === Number(value))?.nome || value;
  }
  if (field === "codEtec") {
    return data.etecs.find((item) => item.codEtec === value)?.nome || value;
  }
  if (field === "idGrupo") {
    return data.grupos.find((item) => item.idGrupo === Number(value))?.nomeGrupo || value;
  }
  if (field === "idOrientacao") {
    const orientation = data.orientacoes.find(
      (item) => item.idOrientacao === Number(value),
    );
    if (!orientation) return value;
    return `RM ${orientation.rmProfessor} · Turma ${orientation.turma}`;
  }
  if (field === "rmProfessor") return `RM ${value}`;
  if (field === "rmAluno") return `RM ${value}`;
  if (field === "dataCriacao") {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
      new Date(`${value}T12:00:00`),
    );
  }
  return String(value);
}

function getDetailFields(role, collection, config) {
  if (role === "visitante" && collection === "tccs") {
    return ["tema", "status", "descricao", "dataCriacao", "linkArtigo", "linkSlide", "linkSite"];
  }
  return config.fields.filter((field) => !["senha", "senhaAdmin"].includes(field));
}

function buildDeleteError(collection, record, data) {
  if (collection === "etecs" && data.cursos.some((item) => item.codEtec === record.codEtec)) {
    return "Esta ETEC possui cursos vinculados. Remova ou transfira os cursos primeiro.";
  }
  if (
    collection === "cursos" &&
    (data.alunos.some((item) => item.idCurso === record.idCurso) ||
      data.orientacoes.some((item) => item.idCurso === record.idCurso))
  ) {
    return "Este curso possui alunos ou orientações vinculados.";
  }
  if (collection === "professores" && data.orientacoes.some((item) => item.rmProfessor === record.rmProfessor)) {
    return "Este professor possui orientações vinculadas.";
  }
  if (collection === "orientacoes" && data.grupos.some((item) => item.idOrientacao === record.idOrientacao)) {
    return "Esta orientação possui grupos vinculados.";
  }
  if (
    collection === "grupos" &&
    (data.alunos.some((item) => item.idGrupo === record.idGrupo) ||
      data.tccs.some((item) => item.idGrupo === record.idGrupo))
  ) {
    return "Este grupo possui alunos ou um TCC vinculado.";
  }
  return "";
}

function getPageTitle(section, role) {
  if (section === "perfil") return "Meu perfil";
  if (section === "conversas") return "Conversas";
  return COLLECTION_CONFIG[section]?.label || (role === "visitante" ? "Explore o BeeHub" : "Visão geral");
}

export function ProfilePicker() {
  const navigate = useNavigate();
  const { loginAs } = useAuth();
  const profiles = [
    { role: "visitante", title: "Visitante", icon: Eye, detail: ROLE_DESCRIPTIONS.visitante },
    { role: "aluno", title: "Aluno", icon: GraduationCap, detail: ROLE_DESCRIPTIONS.aluno, persona: "2026001" },
    { role: "professor", title: "Professor", icon: UserRound, detail: ROLE_DESCRIPTIONS.professor, persona: "12345" },
    { role: "administrador", title: "Administrador", icon: ShieldCheck, detail: ROLE_DESCRIPTIONS.administrador, persona: "1" },
  ];

  const chooseProfile = (profile) => {
    if (profile.persona) {
      localStorage.setItem("beehub-demo-persona-id", profile.persona);
    } else {
      localStorage.removeItem("beehub-demo-persona-id");
    }
    loginAs(profile.role, ROLE_LABELS[profile.role]);
    navigate("/", { replace: true });
  };

  return (
    <main className="profile-picker">
      <section className="profile-card">
        <img className="profile-logo" src={logo} alt="BeeHub" />
        <span className="eyebrow">PLATAFORMA ACADÊMICA</span>
        <h1>Uma jornada melhor para cada TCC.</h1>
        <p className="profile-intro">
          Escolha um perfil para explorar a demonstração. Esta etapa não usa autenticação real.
        </p>
        <div className="profile-options">
          {profiles.map(({ role, title, icon: Icon, detail, persona }) => (
            <button
              className="profile-option"
              key={role}
              onClick={() => chooseProfile({ role, persona })}
            >
              <span className={`profile-option-icon profile-${role}`}>
                <Icon size={21} />
              </span>
              <span className="profile-option-copy">
                <strong>{title}</strong>
                <small>{detail}</small>
              </span>
              <ChevronRight size={19} />
            </button>
          ))}
        </div>
        <p className="demo-footnote">
          <LockKeyhole size={14} /> Dados de exemplo locais. Nenhuma conta ou integração externa.
        </p>
      </section>
      <aside className="profile-aside">
        <div className="profile-aside-content">
          <span className="eyebrow">UM ESPAÇO PARA CONSTRUIR IDEIAS</span>
          <h2>Do primeiro tema à apresentação final.</h2>
          <p>
            Cursos, grupos, orientações e trabalhos conectados em uma experiência organizada.
          </p>
          <div className="aside-orbit" aria-hidden="true">
            <div className="orbit-center"><BookOpen size={36} /></div>
            <span className="orbit-node orbit-node-one"><UsersRound size={20} /></span>
            <span className="orbit-node orbit-node-two"><FileText size={20} /></span>
            <span className="orbit-node orbit-node-three"><GraduationCap size={20} /></span>
          </div>
        </div>
      </aside>
    </main>
  );
}

export function PortalApp() {
  const { role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [stored] = useState(loadDemoData);
  const [data, setData] = useState(stored.data);
  const [storageError, setStorageError] = useState(stored.error);
  const [flash, setFlash] = useState("");
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(null);
  const [formError, setFormError] = useState("");
  const [selectedConversation, setSelectedConversation] = useState("");
  const user = useMemo(() => findCurrentUser(role, data), [role, data]);
  const section = getSectionFromPath(location.pathname);
  const menu = NAV_ITEMS[role] || [];
  const isDetails = ["tcc-detail", "curso-detail"].includes(section);
  const collection = getCollectionForSection(section);
  const allowedSections = new Set(menu.map((item) => item.id));

  if (!menu.length) return <Navigate to="/entrar" replace />;

  if (section === "home" && !allowedSections.has("home")) {
    return <Navigate to="/" replace />;
  }
  if (section === "perfil" && role === "visitante") {
    return <Navigate to="/" replace />;
  }
  if (section === "conversas" && !["aluno", "professor"].includes(role)) {
    return <Navigate to="/" replace />;
  }
  if (
    collection &&
    !allowedSections.has(collection) &&
    !(role === "aluno" && collection === "cursos")
  ) {
    return <Navigate to="/" replace />;
  }
  if (
    isDetails &&
    (role === "administrador" ||
      role === "professor" ||
      role === "aluno" ||
      role === "visitante")
  ) {
    const expected = section === "tcc-detail" ? "tccs" : "cursos";
    if (role !== "administrador" && !allowedSections.has(expected)) {
      return <Navigate to="/" replace />;
    }
  }

  const displayName =
    role === "aluno"
      ? `RM ${user?.rmAluno || "—"}`
      : role === "professor"
        ? `RM ${user?.rmProfessor || "—"}`
        : role === "administrador"
          ? user?.userAdmin || "Administrador"
          : "Visitante";
  const currentTitle = getPageTitle(section, role);

  const closeDialog = () => {
    setDialog(null);
    setFormError("");
  };

  const persistData = (next) => {
    try {
      saveDemoData(next);
      setData(next);
      setStorageError("");
      setFlash("Alterações salvas somente neste navegador.");
      closeDialog();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? `Não foi possível salvar localmente: ${error.message}`
          : "Não foi possível salvar os dados locais.",
      );
    }
  };

  const openEditor = (targetCollection, record) => {
    setFormError("");
    const draft = record || getBlankRecord(targetCollection, data);
    if (!record && targetCollection === "tccs") {
      draft.codTCC = getNextTccCode(data);
      if (role === "aluno") draft.idGrupo = Number(user?.idGrupo) || "";
      if (role === "professor") {
        const assignedGroups = filterCollection(role, user, data, "grupos").filter(
          (group) => !data.tccs.some((item) => item.idGrupo === group.idGrupo),
        );
        if (assignedGroups.length === 1) draft.idGrupo = assignedGroups[0].idGrupo;
      }
    }
    if (!record && targetCollection === "orientacoes" && role === "professor") {
      draft.rmProfessor = user?.rmProfessor || "";
    }
    setDialog({
      type: "form",
      collection: targetCollection,
      record: draft,
      editing: Boolean(record),
      editingKey: record?.[COLLECTION_CONFIG[targetCollection].key],
    });
  };

  const saveRecord = (event) => {
    event.preventDefault();
    const { collection: targetCollection, record, editing, editingKey } = dialog;
    const message = validateRecord(targetCollection, record, data, editingKey);
    if (message) {
      setFormError(message);
      return;
    }
    const next = {
      ...data,
      [targetCollection]: editing
        ? data[targetCollection].map((item) =>
            String(item[COLLECTION_CONFIG[targetCollection].key]) ===
            String(editingKey)
              ? record
              : item,
          )
        : [...data[targetCollection], record],
    };
    persistData(next);
  };

  const deleteRecord = (targetCollection, record) => {
    const key = COLLECTION_CONFIG[targetCollection].key;
    const dependencyError = buildDeleteError(targetCollection, record, data);
    if (dependencyError) {
      setFlash(dependencyError);
      closeDialog();
      return;
    }
    if (!window.confirm(`Excluir este registro de ${COLLECTION_CONFIG[targetCollection].singular}?`)) {
      return;
    }
    persistData({
      ...data,
      [targetCollection]: data[targetCollection].filter(
        (item) => String(item[key]) !== String(record[key]),
      ),
    });
  };

  const switchProfile = () => {
    logout();
    navigate("/entrar", { replace: true });
  };

  const resetData = () => {
    if (!window.confirm("Restaurar os dados iniciais desta demonstração?")) return;
    try {
      const fresh = resetDemoData();
      setData(fresh);
      setStorageError("");
      setFlash("Os dados de demonstração foram restaurados.");
    } catch (error) {
      setStorageError(
        error instanceof Error
          ? `Não foi possível restaurar os dados locais: ${error.message}`
          : "Não foi possível restaurar os dados locais.",
      );
    }
  };

  let page;
  if (section === "home") {
    page = <Dashboard role={role} user={user} data={data} />;
  } else if (section === "perfil") {
    const profileCollection = role === "aluno" ? "alunos" : "professores";
    page = (
      <ResourcePage
        role={role}
        user={user}
        data={data}
        collection={profileCollection}
        rows={filterCollection(role, user, data, profileCollection)}
        onEdit={(record) => openEditor(profileCollection, record)}
        onCreate={() => openEditor(profileCollection, null)}
        onDetail={(record) => setDialog({ type: "detail", collection: profileCollection, record })}
        search={search}
      />
    );
  } else if (section === "conversas") {
    page = (
      <ConversationPage
        role={role}
        user={user}
        data={data}
        selected={selectedConversation}
        onSelect={setSelectedConversation}
      />
    );
  } else if (isDetails) {
    const targetCollection = section === "tcc-detail" ? "tccs" : "cursos";
    const targetId = getPathRecordId(location.pathname);
    const rows = filterCollection(role, user, data, targetCollection);
    const record =
      rows.find(
        (item) =>
          String(item[COLLECTION_CONFIG[targetCollection].key]) === targetId,
      ) || null;
    page = record ? (
      <ResourcePage
        role={role}
        user={user}
        data={data}
        collection={targetCollection}
        rows={[record]}
        onEdit={(item) => openEditor(targetCollection, item)}
        onCreate={() => openEditor(targetCollection, null)}
        onDetail={(item) => setDialog({ type: "detail", collection: targetCollection, record: item })}
        search=""
        detailOnly
      />
    ) : (
      <EmptyState title="Registro não encontrado" text="Ele pode não existir ou não estar disponível para este perfil." />
    );
  } else if (collection) {
    page = (
      <ResourcePage
        role={role}
        user={user}
        data={data}
        collection={collection}
        rows={filterCollection(role, user, data, collection)}
        onEdit={(record) => openEditor(collection, record)}
        onCreate={() => openEditor(collection, null)}
        onDetail={(record) => setDialog({ type: "detail", collection, record })}
        onDelete={(record) => deleteRecord(collection, record)}
        search={search}
      />
    );
  } else {
    page = <Navigate to="/" replace />;
  }

  const pageSearchable =
    (collection && !["administradores", "etecs"].includes(collection)) ||
    section === "perfil";

  return (
    <div className="bee-app">
      <aside className="app-sidebar">
        <Link className="app-brand" to="/" aria-label="BeeHub, início">
          <img src={logo} alt="BeeHub" />
        </Link>
        <div className="workspace-label">ESPAÇO DE TRABALHO</div>
        <nav className="app-navigation" aria-label="Navegação principal">
          {menu.map(({ id, label, path, icon: Icon }) => (
            <Link
              key={id}
              className={`navigation-link ${section === id ? "is-active" : ""}`}
              to={path}
            >
              <Icon size={18} strokeWidth={1.9} />
              <span>{label}</span>
              {section === id && <span className="navigation-indicator" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          {role === "administrador" && (
            <button className="sidebar-reset" onClick={resetData}>
              <RotateCcw size={16} /> Restaurar demonstração
            </button>
          )}
          <div className="profile-identity">
            <span className="identity-avatar">
              {role === "administrador" ? "A" : role === "professor" ? "P" : role === "aluno" ? "E" : "V"}
            </span>
            <span className="identity-copy">
              <strong>{displayName}</strong>
              <small>{ROLE_LABELS[role]}</small>
            </span>
          </div>
          <button className="switch-profile" onClick={switchProfile}>
            <LogOut size={16} /> Trocar perfil
          </button>
        </div>
      </aside>

      <main className="app-main">
        <header className="app-topbar">
          <div className="topbar-context">
            <span className="topbar-overline">BEEHUB · {ROLE_LABELS[role].toUpperCase()}</span>
            <strong>{currentTitle}</strong>
          </div>
          <div className="topbar-actions">
            {pageSearchable && (
              <label className="global-search">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar nesta página"
                  aria-label="Buscar nesta página"
                />
              </label>
            )}
            <span className="role-chip"><span /> Demonstração</span>
          </div>
        </header>
        <div className="page-content">
          {storageError && <div className="notice notice-error">{storageError}</div>}
          {flash && (
            <div className="notice notice-info" role="status">
              <span>{flash}</span>
              <button onClick={() => setFlash("")} aria-label="Fechar aviso"><X size={16} /></button>
            </div>
          )}
          {page}
        </div>
      </main>

      {dialog?.type === "detail" && (
        <DetailDialog
          role={role}
          collection={dialog.collection}
          record={dialog.record}
          data={data}
          onClose={closeDialog}
          onEdit={
            canEdit(role, dialog.collection, dialog.record, user, data)
              ? () => openEditor(dialog.collection, dialog.record)
              : undefined
          }
          onDelete={
            role === "administrador"
              ? () => deleteRecord(dialog.collection, dialog.record)
              : undefined
          }
        />
      )}
      {dialog?.type === "form" && (
        <EntityForm
          role={role}
          user={user}
          collection={dialog.collection}
          record={dialog.record}
          data={data}
          editing={dialog.editing}
          formError={formError}
          onChange={(field, value) =>
            setDialog((current) => ({
              ...current,
              record: { ...current.record, [field]: value },
            }))
          }
          onClose={closeDialog}
          onSave={saveRecord}
        />
      )}
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }) {
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

function Dashboard({ role, user, data }) {
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

  const overview = Object.entries(COLLECTION_CONFIG).map(([key, config]) => ({
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
        description="Acesse cada entidade do MER. Os cadastros de demonstração ficam neste navegador."
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

function orientationSummary(group, data) {
  if (!group) return "Sem orientação vinculada";
  const orientation = data.orientacoes.find(
    (item) => item.idOrientacao === group.idOrientacao,
  );
  if (!orientation) return "Orientação indisponível";
  const professor = data.professores.find(
    (item) => item.rmProfessor === orientation.rmProfessor,
  );
  return `${professor?.email || `RM ${orientation.rmProfessor}`} · Turma ${orientation.turma}`;
}

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <article className="stat-card">
      <span className={`stat-icon tone-${tone}`}><Icon size={19} /></span>
      <span className="stat-copy"><small>{label}</small><strong>{value}</strong></span>
    </article>
  );
}

function Milestone({ title, detail, complete }) {
  return (
    <div className="milestone">
      <span className={`milestone-check ${complete ? "is-complete" : ""}`}>
        {complete ? <Check size={15} /> : <span />}
      </span>
      <span><strong>{title}</strong><small>{detail}</small></span>
    </div>
  );
}

function PublicTccCards({ data, tccs }) {
  if (!tccs.length) {
    return <EmptyState title="O acervo está sendo formado" text="Quando houver trabalhos aprovados ou publicados, eles aparecerão aqui." />;
  }
  return (
    <div className="public-work-grid">
      {tccs.map((item) => {
        const group = data.grupos.find((candidate) => candidate.idGrupo === item.idGrupo);
        const orientation = data.orientacoes.find(
          (candidate) => candidate.idOrientacao === group?.idOrientacao,
        );
        const course = data.cursos.find(
          (candidate) => candidate.idCurso === orientation?.idCurso,
        );
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

function GroupCards({ data, groups }) {
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
            <Link className="inline-action" to="/tccs">
              Ver acompanhamento <ArrowRight size={15} />
            </Link>
          </article>
        );
      })}
    </div>
  );
}

function ResourcePage({
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

  return (
    <>
      <PageHeading
        eyebrow={role === "administrador" ? "GESTÃO DE CADASTROS" : ROLE_LABELS[role].toUpperCase()}
        title={config.label}
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
      {ownRows.length ? (
        <div className="table-panel">
          <div className="table-panel-heading">
            <div><strong>{ownRows.length} registro(s)</strong><span>{config.label} conforme as permissões do perfil</span></div>
            <span className="table-mer-mark"><ShieldCheck size={15} /> Modelo MER</span>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {config.columns.map((field) => <th key={field}>{FIELD_LABELS[field]}</th>)}
                  <th className="actions-heading">Ações</th>
                </tr>
              </thead>
              <tbody>
                {ownRows.map((record) => {
                  const mayEdit = canEdit(role, collection, record, user, data);
                  return (
                    <tr key={record[config.key]}>
                      {config.columns.map((field) => (
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

function DetailCard({ role, collection, record, data, onEdit }) {
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

function SafeExternalLink({ href }) {
  try {
    const parsed = new URL(href);
    if (!["http:", "https:"].includes(parsed.protocol)) return "Link informado";
    return <a href={parsed.href} target="_blank" rel="noreferrer">Abrir link <ArrowRight size={14} /></a>;
  } catch {
    return "Link informado";
  }
}

function EntityForm({
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
  const allowedFields = editing
    ? editableFields(role, collection, config)
    : role === "administrador"
      ? editableFields(role, collection, config)
      : collection === "orientacoes" && role === "professor"
        ? ["idCurso", "turma"]
        : collection === "tccs"
        ? ["codTCC", "idGrupo", "tema", "linkSlide", "linkArtigo", "status", "descricao", "linkSite", "dataCriacao"]
          : [];
  const fields = config.fields.filter(
    (field) =>
      allowedFields.includes(field) ||
    (!editing && field === key && ["administrador", "professor"].includes(role) && collection === "orientacoes"),
  );

  const getFieldType = (field) => {
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
            ? "Preencha os atributos previstos no modelo. Senhas não são exibidas nem persistidas nesta demonstração."
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
            <button type="submit" className="button button-primary"><Check size={16} /> Salvar localmente</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function DetailDialog({ role, collection, record, data, onClose, onEdit, onDelete }) {
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

function ConversationPage({ role, user, data, selected, onSelect }) {
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
        description="Demonstração visual de uma conversa vinculada a um relacionamento existente."
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

function EmptyState({ title, text, action }) {
  return (
    <section className="empty-state">
      <span className="empty-state-icon"><Search size={21} /></span>
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </section>
  );
}
