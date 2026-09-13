import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, Eye } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import minhaImagem from "../../../assets/images/BeeHubHorizontal.jpeg";
import * as S from "../styles";

export function Welcome() {
  const navigate = useNavigate();
  const { loginAs } = useAuth();

  const handleVisitante = () => {
    loginAs("visitante", "Visitante");
    navigate("/", { replace: true });
  };

  return (
    <S.Shell>
      <S.Card>
        <S.LogoRow>
          <img src={minhaImagem} alt="BeeHub" width={200} height={70} />
        </S.LogoRow>

        <S.Title>Bem-vindo ao BeeHub</S.Title>
        <S.Subtitle>
          Escolha seu tipo de acesso para entrar na área correta da plataforma.
        </S.Subtitle>

        <S.RoleList>
          <S.RoleButton
            onClick={() => navigate("/entrar/professor", { replace: true })}
          >
            <Users size={22} strokeWidth={1.8} />
            <div>
              Sou professor/orientador
              <S.RoleButtonSub>
                Gerencie grupos, arquivos e revisões.
              </S.RoleButtonSub>
            </div>
          </S.RoleButton>

          <S.RoleButton
            onClick={() => navigate("/entrar/aluno", { replace: true })}
          >
            <GraduationCap size={22} strokeWidth={1.8} />
            <div>
              Sou estudante
              <S.RoleButtonSub>
                Desenvolva seu TCC, envie arquivos e converse.
              </S.RoleButtonSub>
            </div>
          </S.RoleButton>

          <S.RoleButton onClick={handleVisitante}>
            <Eye size={22} strokeWidth={1.8} />
            <div>
              Sou visitante
              <S.RoleButtonSub>
                Explore trabalhos já concluídos e conteúdos públicos.
              </S.RoleButtonSub>
            </div>
          </S.RoleButton>
        </S.RoleList>
      </S.Card>
    </S.Shell>
  );
}
