import { User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; // Importando navegação do React Router
import { useAuth } from '../../context/AuthContext'; 
import LogoUm from '../../assets/images/BeeHubIcon.jpeg'; 
import * as S from './styles';

// Transformamos o array simples em um array de objetos com os caminhos (paths)
const NAV_LINKS = [
  { name: 'CURSOS', path: '/cursos' },
  { name: 'SUPORTE', path: '/suporte' },
  { name: 'SOBRE', path: '/sobre' }
];

export function Header({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation(); // Lê a URL atual (ex: '/cursos')
  const { userName } = useAuth(); 

  return (
    <S.Wrapper>
      <S.LogoArea>
        <S.LogoIconBox>
          <img src={LogoUm} alt="Logo BeeHub" width={70} height={70} />
        </S.LogoIconBox>
        <S.LogoText>BeeHub</S.LogoText>
      </S.LogoArea>

      <S.CenterNav>
        {NAV_LINKS.map((link) => (
          <S.NavButton
            key={link.name}
            // O botão fica ativo se o caminho (path) for igual à URL atual
            $active={location.pathname === link.path} 
            // Quando clica, navega para a página correspondente
            onClick={() => navigate(link.path)}
          >
            {link.name}
          </S.NavButton>
        ))}
      </S.CenterNav>

      <S.UserArea>
        <S.Avatar>
          <User size={18} />
        </S.Avatar>
        <S.UserName>{userName || 'Usuário'}</S.UserName> 
        <S.LogoutButton onClick={onLogout}>
          <LogOut size={14} />
          SAIR
        </S.LogoutButton>
      </S.UserArea>
    </S.Wrapper>
  );
}