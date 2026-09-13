import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, FolderKanban, Settings, MessageSquare, User, ChevronLeft } from 'lucide-react';
import * as S from './styles';

const NAV_ITEMS = [
  { label: 'DASHBOARD', path: '/', icon: LayoutGrid },
  { label: 'MEUS PROJETOS', path: '/projetos', icon: FolderKanban },
  { label: 'CONFIGURAÇÕES', path: '/configuracoes', icon: Settings },
  { label: 'CONVERSAS', path: '/conversas', icon: MessageSquare, badge: 4 },
  { label: 'MEU PERFIL', path: '/perfil', icon: User },
];

// Visitante não pode acessar Meus Projetos, Conversas nem Meu Perfil — então
// esses itens nem aparecem na sidebar pra esse perfil (o RequireRole no
// App.jsx bloqueia o acesso direto por URL também, isso aqui é só a UI).
const HIDDEN_FOR_VISITANTE = new Set(['/projetos', '/conversas', '/perfil']);

// collapsed/onToggle vêm do Layout: assim o <main> também sabe o quanto
// deve deslocar o conteúdo, sem duplicar o estado em dois componentes.
export function Sidebar({ collapsed, onToggle, role }) {
  const location = useLocation();

  const items =
    role === 'visitante'
      ? NAV_ITEMS.filter((item) => !HIDDEN_FOR_VISITANTE.has(item.path))
      : NAV_ITEMS;

  return (
    <S.Wrapper $collapsed={collapsed}>
      <S.NavList>
        {items.map(({ label, path, icon: Icon, badge }) => {
          const active = location.pathname === path;
          return (
            <S.NavItem key={path} as={Link} to={path} $active={active}>
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
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        <ChevronLeft size={16} />
      </S.CollapseButton>
    </S.Wrapper>
  );
}
