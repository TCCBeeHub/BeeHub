import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Eye, FileText, GraduationCap, LogIn, Moon, Sun, UserRound, UsersRound } from "lucide-react";
import logo from "/imagens/BeeHubHorizontal.jpeg";
import { ROLE_LABELS } from "./portal-data";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, continueAsVisitor } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [selectedAccess, setSelectedAccess] = useState(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectAccess = (access) => {
    setSelectedAccess(access);
    setIdentifier("");
    setPassword("");
    setError("");
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({
        role: selectedAccess,
        identifier: identifier.trim(),
        password,
      });
      navigate("/", { replace: true });
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Não foi possível entrar. Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const enterAsVisitor = () => {
    continueAsVisitor();
    navigate("/", { replace: true });
  };

  return (
    <main className="login-page" data-theme={theme}>
      <section className="login-card">
        <button
          className="theme-toggle login-theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={`Ativar tema ${theme === "light" ? "escuro" : "claro"}`}
          title={`Ativar tema ${theme === "light" ? "escuro" : "claro"}`}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <img className="profile-logo" src={logo} alt="BeeHub" />
        <span className="eyebrow">PLATAFORMA ACADÊMICA</span>
        {!selectedAccess ? (
          <>
            <h1>Como deseja acessar?</h1>
            <p className="profile-intro">
              Escolha seu espaço para continuar no BeeHub.
            </p>
            <div className="access-cards" aria-label="Opções de acesso">
              <button
                className="access-card"
                type="button"
                onClick={() => selectAccess("aluno")}
              >
                <span className="access-card-icon"><GraduationCap size={22} /></span>
                <strong>Aluno</strong>
                <span>Acompanhe seu grupo e TCC</span>
                <ArrowRight className="access-card-arrow" size={17} />
              </button>
              <button
                className="access-card"
                type="button"
                onClick={() => selectAccess("professor")}
              >
                <span className="access-card-icon access-card-icon-gold"><UserRound size={21} /></span>
                <strong>Professor</strong>
                <span>Gerencie suas orientações</span>
                <ArrowRight className="access-card-arrow" size={17} />
              </button>
              <button
                className="access-card"
                type="button"
                onClick={enterAsVisitor}
              >
                <span className="access-card-icon access-card-icon-green"><Eye size={20} /></span>
                <strong>Visitante</strong>
                <span>Explore cursos e TCCs públicos</span>
                <ArrowRight className="access-card-arrow" size={17} />
              </button>
            </div>
            <button
              className="admin-access-link"
              type="button"
              onClick={() => selectAccess("administrador")}
            >
              Acesso administrativo
            </button>
          </>
        ) : (
          <>
            <button
              className="login-back-link"
              type="button"
              onClick={() => selectAccess(null)}
              disabled={submitting}
            >
              <ArrowRight size={15} /> Voltar às opções
            </button>
            <h1>
              {selectedAccess === "administrador"
                ? "Acesso administrativo"
                : `Entrar como ${ROLE_LABELS[selectedAccess].toLowerCase()}`}
            </h1>
            <p className="profile-intro">
              Informe suas credenciais. O sistema confirma seu perfil e suas permissões.
            </p>
            <form className="login-form" onSubmit={submitLogin}>
              <label className="form-field">
                <span>
                  {selectedAccess === "administrador"
                    ? "Usuário administrador"
                    : `RM do ${selectedAccess}`}
                </span>
                <input
                  autoComplete="username"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder={
                    selectedAccess === "administrador"
                      ? "Digite seu usuário"
                      : "Digite seu RM"
                  }
                  required
                />
              </label>
              <label className="form-field">
                <span>Senha</span>
                <input
                  autoComplete="current-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Digite sua senha"
                  required
                />
              </label>
              {error && <div className="form-error" role="alert">{error}</div>}
              <button className="button button-primary login-submit" disabled={submitting}>
                <LogIn size={17} />
                {submitting ? "Entrando..." : "Entrar"}
              </button>
            </form>
            <p className="login-help">Problemas para acessar? Procure o administrador da sua ETEC.</p>
          </>
        )}
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
