import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  FolderKanban,
  Settings,
  MessageSquare,
  User,
  ChevronLeft,
  UsersRound,
  ClipboardCheck,
} from "lucide-react";
import * as S from "./styles";

const ALUNO_ITEMS = [
  { label: "DASHBOARD", path: "/", icon: LayoutGrid },
  { label: "MEUS PROJETOS", path: "/projetos", icon: FolderKanban },
  { label: "CONVERSAS", path: "/conversas", icon: MessageSquare, badge: 4 },
  { label: "CONFIGURAÇÕES", path: "/configuracoes", icon: Settings },
  { label: "MEU PERFIL", path: "/perfil", icon: User },
];

const PROFESSOR_ITEMS = [
  { label: "PAINEL", path: "/", icon: LayoutGrid },
  { label: "MEUS GRUPOS", path: "/grupos", icon: UsersRound },
  { label: "REVISÕES", path: "/revisoes", icon: ClipboardCheck },
  { label: "CONVERSAS", path: "/conversas", icon: MessageSquare },
  { label: "CONFIGURAÇÕES", path: "/configuracoes", icon: Settings },
  { label: "MEU PERFIL", path: "/perfil", icon: User },
];

const VISITANTE_ITEMS = [{ label: "DASHBOARD", path: "/", icon: LayoutGrid }];

export function Sidebar({ collapsed, onToggle, role }) {
  const location = useLocation();
  const source =
    role === "professor"
      ? PROFESSOR_ITEMS
      : role === "visitante"
        ? VISITANTE_ITEMS
        : ALUNO_ITEMS;

  return (
    <S.Wrapper $collapsed={collapsed}>
      <S.NavList aria-label={`Navegação principal ${role}`}>
        {source.map(({ label, path, icon: Icon, badge }) => {
          const active =
            path === "/"
              ? location.pathname === "/"
              : location.pathname === path ||
                location.pathname.startsWith(`${path}/`);
          return (
            <S.NavItem
              key={`${label}-${path}`}
              as={Link}
              to={path}
              $active={active}
            >
              <Icon size={20} strokeWidth={1.9} />
              <S.NavLabel $collapsed={collapsed}>{label}</S.NavLabel>
              {badge && <S.Badge $collapsed={collapsed}>{badge}</S.Badge>}
            </S.NavItem>
          );
        })}
      </S.NavList>

      <S.CollapseButton
        $collapsed={collapsed}
        onClick={onToggle}
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        <ChevronLeft size={16} />
      </S.CollapseButton>
    </S.Wrapper>
  );
}
