import { useNavigate } from 'react-router-dom';
import { BookOpen, Atom, GraduationCap, Users, Eye } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import minhaImagem from '../../../assets/images/BeeHubHorizontal.jpeg';
import * as S from '../styles';

export function Welcome() {
  const navigate = useNavigate();
  const { loginAs } = useAuth();

  const handleVisitante = () => {
    loginAs('visitante');
    navigate('/');
  };

  return (
    <S.Shell>
      <S.Card>
        <S.LogoRow>
          <img src={minhaImagem} alt="Logo" width={200} height={70} />
        </S.LogoRow>

        <S.Title>Bem-vindo</S.Title>
        <S.Subtitle>
          Selecione o que você é. Seu acesso será liberado de acordo com o
          perfil escolhido.
        </S.Subtitle>

        <S.RoleList>
          <S.RoleButton onClick={() => navigate('/entrar/professor')}>
            <Users size={22} strokeWidth={1.8} />
            <div>
              Sou professor/orientador
              <S.RoleButtonSub>Acompanha e comenta os projetos em andamento</S.RoleButtonSub>
            </div>
          </S.RoleButton>

          <S.RoleButton onClick={() => navigate('/entrar/aluno')}>
            <GraduationCap size={22} strokeWidth={1.8} />
            <div>
              Sou estudante
              <S.RoleButtonSub>Acesso completo: desenvolvimento, chat e projeto</S.RoleButtonSub>
            </div>
          </S.RoleButton>

          <S.RoleButton onClick={handleVisitante}>
            <Eye size={22} strokeWidth={1.8} />
            <div>
              Sou visitante
              <S.RoleButtonSub>Acesso limitado: vê apenas os projetos já concluídos</S.RoleButtonSub>
            </div>
          </S.RoleButton>
        </S.RoleList>
      </S.Card>
    </S.Shell>
  );
}