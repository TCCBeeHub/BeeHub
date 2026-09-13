import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import * as S from '../styles';

export function LoginAluno() {
  const navigate = useNavigate();
  const { loginAs } = useAuth();
  const [rm, setRm] = useState('');
  const [escola, setEscola] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // CORREÇÃO: Passamos um NOME simulado para o AuthContext (para aparecer na NavBar).
    // Num sistema real, o backend retornaria o nome do aluno após validar o RM e a senha.
    loginAs('aluno', 'Nome do Aluno (Simulado)'); 
    
    // Salvamos o RM e a Escola localmente para o Perfil puxar corretamente
    localStorage.setItem('usuarioRM', rm);
    localStorage.setItem('usuarioEscola', escola);
    
    navigate('/');
  };

  return (
    <S.Shell>
      <S.Card>
        <S.LogoRow>
          <GraduationCap size={24} strokeWidth={1.8} />
          <S.LogoText>ÁREA DO ALUNO</S.LogoText>
        </S.LogoRow>

        <S.Title>Entrar como aluno</S.Title>
        <S.Subtitle>Use seu R.M., selecione sua escola e insira a senha.</S.Subtitle>

        <S.Form onSubmit={handleSubmit}>
          <S.Field>
            R.M.
            <S.Input
              value={rm}
              onChange={(e) => setRm(e.target.value)}
              placeholder="Seu Registro de Matrícula"
              required
            />
          </S.Field>

          <S.Field>
            Escola (ETEC)
            {/* Tag select HTML padrão adaptada para o formulário */}
            <select
              value={escola}
              onChange={(e) => setEscola(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', backgroundColor: '#fff', fontSize: '0.875rem' }}
            >
              <option value="" disabled>Selecione sua ETEC...</option>
              <option value="ETEC Centro">ETEC Centro</option>
              <option value="ETEC Zona Leste">ETEC Zona Leste</option>
            </select>
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