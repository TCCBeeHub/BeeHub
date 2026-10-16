import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import * as S from '../styles';

export function LoginProfessor() {
  const navigate = useNavigate();
  const { loginAs } = useAuth();
  const [registro, setRegistro] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // CORREÇÃO: Passamos um NOME simulado. Num sistema real, vem do banco de dados.
    loginAs('professor', 'Prof. Orientador (Simulado)');
    
    // Salvamos o Registro localmente para o Perfil
    localStorage.setItem('usuarioRM', registro);
    localStorage.setItem('usuarioEscola', 'ETEC (Professor)'); 
    
    navigate('/');
  };

  return (
    <S.Shell>
      <S.Card>
        <S.LogoRow>
          <Users size={24} strokeWidth={1.8} />
          <S.LogoText>ÁREA DO PROFESSOR</S.LogoText>
        </S.LogoRow>

        <S.Title>Entrar como professor/orientador</S.Title>
        <S.Subtitle>Use seu Número de Registro e senha cadastrados.</S.Subtitle>

        <S.Form onSubmit={handleSubmit}>
          <S.Field>
            Nº de Registro
            <S.Input
              value={registro}
              onChange={(e) => setRegistro(e.target.value)}
              placeholder="Sua matrícula institucional"
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
              <S.HelpBubble>Não vai pedir login de novo neste navegador.</S.HelpBubble>
            </S.HelpTip>
          </S.CheckRow>

          <S.SubmitButton type="submit">ENTRAR</S.SubmitButton>
          <S.ForgotLink type="button">Esqueci minha senha</S.ForgotLink>
        </S.Form>

        <S.BackLink type="button" onClick={() => navigate('/entrar')}>
          <ArrowLeft size={12} style={{ display: 'inline', marginRight: 4 }} />
          Voltar
        </S.BackLink>
      </S.Card>
    </S.Shell>
  );
}