import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import * as S from "../styles";

export function LoginProfessor() {
  const navigate = useNavigate();
  const { loginAs } = useAuth();
  const [registro, setRegistro] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (registro.length !== 5) return;

    // CORREÇÃO: Passamos um NOME simulado. Num sistema real, vem do banco de dados.
    loginAs("professor", "Prof. Orientador (Simulado)");

    // Salvamos o Registro localmente para o Perfil
    localStorage.setItem("usuarioRM", registro);
    localStorage.setItem("usuarioEscola", "ETEC (Professor)");
    localStorage.setItem(
      "usuarioEmail",
      `professor.${registro}@etec.sp.gov.br`,
    );

    navigate("/", { replace: true });
  };

  return (
    <S.Shell>
      <S.Card>
        <S.LogoRow>
          <Users size={24} strokeWidth={1.8} />
          <S.LogoText>ÁREA DO PROFESSOR</S.LogoText>
        </S.LogoRow>

        <S.Title>Entrar como professor/orientador</S.Title>
        <S.Subtitle>
          Use seu Número de Registro com exatamente 5 números e a senha
          cadastrada.
        </S.Subtitle>

        <S.Form onSubmit={handleSubmit}>
          <S.Field>
            Nº de Registro
            <S.Input
              value={registro}
              onChange={(e) =>
                setRegistro(e.target.value.replace(/\D/g, "").slice(0, 5))
              }
              inputMode="numeric"
              maxLength={5}
              minLength={5}
              pattern="[0-9]{5}"
              placeholder="Ex.: 12345"
              required
            />
          </S.Field>

          <S.Field>
            Senha
            <S.Input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
            />
          </S.Field>

          <S.CheckRow>
            <S.Checkbox />
            Manter conectado
            <S.HelpTip>
              ?
              <S.HelpBubble>
                Não vai pedir login de novo neste navegador.
              </S.HelpBubble>
            </S.HelpTip>
          </S.CheckRow>

          <S.SubmitButton type="submit">ENTRAR</S.SubmitButton>
          <S.ForgotLink as="span">
            Recuperação de senha pelo suporte
          </S.ForgotLink>
        </S.Form>
      </S.Card>
    </S.Shell>
  );
}
