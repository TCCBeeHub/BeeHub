import { useCallback, useEffect, useState } from "react";
import { LogOut, Search, X } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import logo from "/imagens/BeeHubHorizontal.jpeg";
import { createEntity, deleteEntity, getPortalData, updateEntity, updateProfessorGroup, updateProfessorGroupTcc } from "../../services/portalApi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { ACCOUNT_PASSWORD_FIELDS, buildDeleteError, COLLECTION_CONFIG, filterCollection, getCollectionForSection, getPageTitle, getPathRecordId, getSectionFromPath, getTccCourse, matchesId, NAV_ITEMS, ROLE_LABELS } from "./portal-data";
import { canDelete, canEdit, canCreate, getBlankRecord, getNextTccCode, validateRecord } from "./portal-records";
import { Dashboard } from "./Dashboard";
import { ConversationPage } from "./ConversationPage";
import { EntityForm, DetailDialog } from "./EntityForms";
import { GroupWorkspacePage } from "./GroupWorkspacePage";
import { ResourcePage } from "./ResourcePage";
import { EmptyState, GroupCards, PageHeading, PublicCourseTccPage, ThemeToggle, UserProfilePage } from "./PortalShared";
import "./portal.css";

export { LoginPage } from "./LoginPage";

export function PortalApp() {
  const { role, user, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(() =>
    Object.fromEntries(Object.keys(COLLECTION_CONFIG).map((key) => [key, []])),
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [flash, setFlash] = useState("");
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(null);
  const [formError, setFormError] = useState("");
  const refreshPortal = useCallback(async (signal) => {
    setLoading(true);
    setLoadError("");
    try {
      setData(await getPortalData({ role, user, signal }));
    } catch (error) {
      if (signal?.aborted) return;
      setLoadError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os dados do servidor.",
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [role, user]);
  useEffect(() => {
    const controller = new AbortController();
    refreshPortal(controller.signal);
    return () => controller.abort();
  }, [refreshPortal]);
  const section = getSectionFromPath(location.pathname);
  const ownStudent = role === "aluno"
    ? data.alunos.find((item) => matchesId(item.rmAluno, user?.rmAluno))
    : null;
  const studentGroupId = user?.idGrupo ?? ownStudent?.idGrupo;
  const hasStudentGroup =
    studentGroupId != null &&
    studentGroupId !== "" &&
    data.grupos.some((group) => matchesId(group.idGrupo, studentGroupId));
  const menu = role === "aluno" && !hasStudentGroup
    ? NAV_ITEMS.aluno.filter((item) => !["tccs", "conversas"].includes(item.id))
    : NAV_ITEMS[role] || [];
  const isDetails = section === "tcc-detail";
  const isGroupDetails = role === "professor" &&
    section === "grupos" &&
    location.pathname.split("/").filter(Boolean).length === 2;
  const collection = getCollectionForSection(section);
  const allowedSections = new Set(menu.map((item) => item.id));

  if (!menu.length) return <Navigate to="/entrar" replace />;

  if (section === "home" && !allowedSections.has("home")) {
    return <Navigate to="/" replace />;
  }
  if (section === "perfil" && role === "visitante") {
    return <Navigate to="/" replace />;
  }
  if (
    section === "conversas" &&
    (!["aluno", "professor"].includes(role) || !allowedSections.has("conversas"))
  ) {
    return <Navigate to="/" replace />;
  }
  if (
    role === "aluno" &&
    !hasStudentGroup &&
    ["conversas", "tccs"].includes(section)
  ) {
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
    (isDetails || section === "curso-tccs") &&
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
    user?.displayName ||
    user?.userAdmin ||
    (role === "aluno"
      ? `RM ${user?.rmAluno || "—"}`
      : role === "professor"
        ? `RM ${user?.rmProfessor || "—"}`
        : role === "administrador"
          ? "Administrador"
          : "Visitante");
  const currentTitle = getPageTitle(section, role);

  const closeDialog = () => {
    setDialog(null);
    setFormError("");
  };

  const openEditor = (targetCollection, record) => {
    setFormError("");
    const draft = record || { ...getBlankRecord(targetCollection, data) };
    if (!record && ACCOUNT_PASSWORD_FIELDS[targetCollection]) {
      draft[ACCOUNT_PASSWORD_FIELDS[targetCollection]] = "";
    }
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
    setDialog({
      type: "form",
      collection: targetCollection,
      record: draft,
      editing: Boolean(record),
      editingKey: record?.[COLLECTION_CONFIG[targetCollection].key],
    });
  };

  const saveRecord = async (event) => {
    event.preventDefault();
    const { collection: targetCollection, record, editing, editingKey } = dialog;
    const message = validateRecord(targetCollection, record, data, editingKey, role, user);
    if (message) {
      setFormError(message);
      return;
    }
    try {
      if (editing) {
        if (role === "professor" && targetCollection === "grupos") {
          await updateProfessorGroup(editingKey, record);
        } else if (role === "professor" && targetCollection === "tccs") {
          await updateProfessorGroupTcc(record.idGrupo, record);
        } else {
          await updateEntity(targetCollection, editingKey, record);
        }
      } else {
        const payload = { ...record };
        if (targetCollection === "cursos") delete payload.idCurso;
        if (targetCollection === "grupos") {
          delete payload.idGrupo;
          delete payload.linkFoto;
        }
        if (targetCollection === "alunos") {
          for (const field of ["email", "descricao", "linkFoto", "idGrupo"]) {
            delete payload[field];
          }
        }
        if (targetCollection === "professores") {
          for (const field of ["email", "descricao", "linkFoto"]) {
            delete payload[field];
          }
        }
        await createEntity(targetCollection, payload);
      }
      closeDialog();
      setFlash("Alterações salvas no servidor.");
      await refreshPortal();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar as alterações no servidor.",
      );
    }
  };

  const deleteRecord = async (targetCollection, record) => {
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
    try {
      await deleteEntity(targetCollection, record[key]);
      closeDialog();
      setFlash("Registro excluído do servidor.");
      await refreshPortal();
    } catch (error) {
      setFlash(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o registro do servidor.",
      );
    }
  };

  const switchProfile = () => {
    logout();
    navigate("/entrar", { replace: true });
  };

  let page;
  if (section === "home") {
    page = <Dashboard role={role} user={user} data={data} />;
  } else if (section === "perfil") {
    const profileCollection = role === "aluno" ? "alunos" : "professores";
    const profileRows = filterCollection(role, user, data, profileCollection);
    page = (
      <UserProfilePage
        role={role}
        record={profileRows[0]}
        data={data}
        onEdit={() => profileRows[0] && openEditor(profileCollection, profileRows[0])}
      />
    );
  } else if (section === "conversas") {
    page = (
      <ConversationPage
        role={role}
        user={user}
        data={data}
      />
    );
  } else if (section === "curso-tccs") {
    const courseId = getPathRecordId(location.pathname);
    const course = data.cursos.find((item) => matchesId(item.idCurso, courseId));
    const publicTccs = filterCollection(role, user, data, "tccs").filter(
      (item) => course && getTccCourse(item, data)?.idCurso === course.idCurso,
    );
    page = course ? (
      <PublicCourseTccPage
        course={course}
        data={data}
        tccs={publicTccs}
        search={search}
      />
    ) : (
      <EmptyState title="Curso não encontrado" text="O curso selecionado não está disponível." />
    );
  } else if (role === "professor" && section === "grupos") {
    const groups = filterCollection(role, user, data, "grupos");
    const group = isGroupDetails
      ? groups.find((item) => matchesId(item.idGrupo, getPathRecordId(location.pathname)))
      : null;
    page = group ? (
      <GroupWorkspacePage
        group={group}
        data={data}
        user={user}
        onEditGroup={() => openEditor("grupos", group)}
        onDeleteGroup={
          canDelete(role, "grupos", group, user, data)
            ? () => deleteRecord("grupos", group)
            : undefined
        }
        onRefresh={() => refreshPortal()}
      />
    ) : isGroupDetails ? (
      <EmptyState title="Grupo não encontrado" text="O grupo não existe ou não está vinculado às suas orientações." />
    ) : (
      <>
        <PageHeading
          eyebrow="ÁREA DO PROFESSOR"
          title="Meus grupos"
          description="Crie grupos nas suas orientações e acompanhe alunos, TCCs e conversas em cada espaço."
          action={
            canCreate(role, "grupos", data, user) ? (
              <button className="button button-primary" onClick={() => openEditor("grupos", null)}>
                Novo grupo
              </button>
            ) : undefined
          }
        />
        <GroupCards data={data} groups={groups} />
      </>
    );
  } else if (isDetails) {
    const targetCollection = "tccs";
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
    section === "perfil" ||
    section === "curso-tccs";

  return (
    <div className="bee-app" data-theme={theme}>
      <aside className="app-sidebar">
        <Link className="app-brand" to="/" aria-label="BeeHub, início">
          <img src={logo} alt="BeeHub" />
        </Link>
        <div className="workspace-label">ESPAÇO DE TRABALHO</div>
        <nav className="app-navigation" aria-label="Navegação principal">
          {menu.map(({ id, label, path, icon: Icon }) => {
            return (
            <Link
              key={id}
              className={`navigation-link ${section === id ? "is-active" : ""}`}
              to={path}
            >
              <Icon size={18} strokeWidth={1.9} />
              <span>{label}</span>
              {section === id && <span className="navigation-indicator" />}
            </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
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
            <LogOut size={16} /> Sair
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
            <span className="role-chip"><span /> {role === "visitante" ? "Acesso público" : "Conectado"}</span>
            <ThemeToggle />
          </div>
        </header>
        <div className="page-content">
          {flash && (
            <div className="notice notice-info" role="status">
              <span>{flash}</span>
              <button onClick={() => setFlash("")} aria-label="Fechar aviso"><X size={16} /></button>
            </div>
          )}
          {loading ? (
            <div className="portal-state" role="status">Carregando dados do servidor...</div>
          ) : loadError ? (
            <div className="portal-state portal-state-error" role="alert">
              <strong>Não foi possível abrir o BeeHub</strong>
              <p>{loadError}</p>
              <button className="button button-primary" onClick={() => refreshPortal()}>
                Tentar novamente
              </button>
            </div>
          ) : page}
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
