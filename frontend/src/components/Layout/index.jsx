import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { useAuth } from '../../context/AuthContext';
import * as S from './styles';

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, userName, role } = useAuth();
  const navigate = useNavigate();

  // Professor não usa a sidebar (ver rascunho): o conteúdo ocupa a largura
  // toda, e os itens que estariam na sidebar (perfil, configurações) vão
  // pro nav central do Header em vez disso.
  const showSidebar = role !== 'professor';

  const handleLogout = () => {
    logout();
    navigate('/entrar');
  };

  const displayName =
    userName || (role === 'visitante' ? 'Visitante' : role === 'professor' ? 'Professor(a)' : 'Aluno TCC');

  return (
    <>
      <Header userName={displayName} role={role} onLogout={handleLogout} />
      {showSidebar && (
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} role={role} />
      )}
      <S.Main $collapsed={collapsed} $noSidebar={!showSidebar}>
        <Outlet />
      </S.Main>
    </>
  );
}
