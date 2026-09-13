import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";
import { BackButton } from "../BackButton";
import { useAuth } from "../../context/AuthContext";
import * as S from "./styles";

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, userName, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/entrar", { replace: true });
  };

  const displayName =
    userName ||
    (role === "visitante"
      ? "Visitante"
      : role === "professor"
        ? "Professor(a)"
        : "Aluno TCC");

  return (
    <>
      <Header userName={displayName} role={role} onLogout={handleLogout} />
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
        role={role}
      />
      <S.Main $collapsed={collapsed}>
        <BackButton fallback="/" />
        <Outlet />
      </S.Main>
    </>
  );
}
