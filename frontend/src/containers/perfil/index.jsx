import { useRef, useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as S from './styles';

export function Perfil() {
  const { userName } = useAuth();
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [salvo, setSalvo] = useState(false);

  // Resgatando RM e Escola salvos no login (ou valores vazios se não encontrar)
  const rmSalvo = localStorage.getItem('usuarioRM') || '';
  const escolaSalva = localStorage.getItem('usuarioEscola') || '';

  const [form, setForm] = useState({
    nome: userName || '',     // Nome vem do AuthContext corretamente agora
    rm: rmSalvo,              // R.M. ou Registro puxado do localStorage
    escola: escolaSalva,      // Escola selecionada no login
    curso: 'Análise e Desenvolvimento de Sistemas', // Simulação de banco de dados
    serie: '3º Módulo',                             // Simulação de banco de dados
    sobreMim: '',
  });

  const handleField = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleTrocarFoto = () => {
    fileInputRef.current?.click();
  };

  const handleArquivoSelecionado = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  };

  // Estilo visual para campos não editáveis
  const disabledStyle = { 
    backgroundColor: '#f3f4f6', 
    color: '#6b7280', 
    cursor: 'not-allowed', 
    userSelect: 'none' 
  };

  return (
    <S.Card>
      <S.Title>MEU PERFIL</S.Title>

      <S.AvatarRow>
        <S.AvatarWrapper>
          <S.Avatar $imageUrl={avatarUrl}>{!avatarUrl && <Camera size={26} />}</S.Avatar>
          <S.AvatarEditButton type="button" onClick={handleTrocarFoto} aria-label="Trocar foto">
            <Camera size={14} />
          </S.AvatarEditButton>
          <S.HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleArquivoSelecionado}
          />
        </S.AvatarWrapper>
        <S.AvatarHint>
          Clique no ícone da câmera pra trocar sua foto de perfil.
        </S.AvatarHint>
      </S.AvatarRow>

      <form onSubmit={handleSalvar}>
        <S.FieldsGrid>
          {/* CAMPOS REGISTRADOS PELA SECRETARIA (Não editáveis) */}
          <S.Field>
            Nome Institucional
            <S.Input value={form.nome} readOnly style={disabledStyle} />
          </S.Field>
          
          <S.Field>
            R.M. / Nº de Registro
            <S.Input value={form.rm} readOnly style={disabledStyle} />
          </S.Field>
          
          <S.Field>
            Escola
            <S.Input value={form.escola} readOnly style={disabledStyle} />
          </S.Field>
          
          <S.Field>
            Curso
            <S.Input value={form.curso} readOnly style={disabledStyle} />
          </S.Field>
          
          <S.Field>
            Série / Módulo
            <S.Input value={form.serie} readOnly style={disabledStyle} />
          </S.Field>
        </S.FieldsGrid>

        {/* CAMPOS EDITÁVEIS PELO USUÁRIO */}
        <S.Field>
          Sobre mim
          <S.TextArea
            value={form.sobreMim}
            onChange={handleField('sobreMim')}
            placeholder="Conte um pouco sobre você, suas habilidades e interesses no TCC..."
          />
        </S.Field>

        <S.FooterRow>
          <S.SaveButton type="submit">SALVAR ALTERAÇÕES</S.SaveButton>
          <S.SavedMessage $visible={salvo}>Alterações salvas!</S.SavedMessage>
        </S.FooterRow>
      </form>
    </S.Card>
  );
}