import { useRef, useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { updateEntity } from "../../services/portalApi";
import * as S from "./styles";

// Recebe os dados reais do usuário/aluno via props
export function Perfil({ data, user, role, onUpdate }) {
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [salvo, setSalvo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState("");

  // Pega os dados do aluno se for aluno, ou do professor se for professor
  const alunoOriginal = role === "aluno" ? data.alunos.find(a => String(a.rmAluno) === String(user.rmAluno)) : null;
  const professorOriginal = role === "professor" ? data.professores.find(p => String(p.rmProfessor) === String(user.rmProfessor)) : null;
  
  const perfilOriginal = alunoOriginal || professorOriginal;

  const [form, setForm] = useState({
    nome: perfilOriginal?.nome || "",
    rm: alunoOriginal?.rmAluno || professorOriginal?.rmProfessor || "",
    email: perfilOriginal?.email || "",
    escola: alunoOriginal?.curso?.etec?.nome || professorOriginal?.orientacao?.curso?.etec?.nome || "",
    curso: alunoOriginal?.curso?.nome || "—",
    serie: alunoOriginal?.turma ? `Turma ${alunoOriginal.turma}` : "—",
    sobreMim: perfilOriginal?.descricao || "",
    linkFoto: perfilOriginal?.linkFoto || "",
  });

  useEffect(() => {
    if (perfilOriginal) {
      setForm({
        nome: perfilOriginal.nome || "",
        rm: alunoOriginal?.rmAluno || professorOriginal?.rmProfessor || "",
        email: perfilOriginal.email || "",
        escola: alunoOriginal?.curso?.etec?.nome || professorOriginal?.orientacao?.curso?.etec?.nome || "",
        curso: alunoOriginal?.curso?.nome || "—",
        serie: alunoOriginal?.turma ? `Turma ${alunoOriginal.turma}` : "—",
        sobreMim: perfilOriginal.descricao || "",
        linkFoto: perfilOriginal.linkFoto || "",
      });
      setAvatarUrl(perfilOriginal.linkFoto || null);
    }
  }, [perfilOriginal, alunoOriginal, professorOriginal]);

  const handleField = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleTrocarFoto = () => {
    fileInputRef.current?.click();
  };

  const handleArquivoSelecionado = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Cria uma URL local apenas para preview. Num sistema real, faríamos upload para um bucket (AWS S3, Cloudinary, etc.)
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    setForm(prev => ({ ...prev, linkFoto: url })); 
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!perfilOriginal) return;
    
    setIsSubmitting(true);
    setErro("");
    
    try {
      const payload = {
        descricao: form.sobreMim,
        urlFoto: form.linkFoto,
        // Mantemos os campos que o DTO de atualização exige, mesmo sem mudar
        email: form.email, 
        novaSenha: "", 
      };

      // Atualiza no backend na rota correta
      if (role === "aluno") {
        await updateEntity("alunos", user.rmAluno, payload);
      } else {
        await updateEntity("professores", user.rmProfessor, payload);
      }

      setSalvo(true);
      setTimeout(() => setSalvo(false), 2500);
      if (onUpdate) onUpdate(); // Atualiza os dados globais no PortalApp
    } catch (error) {
      setErro(error.message || "Erro ao salvar as alterações.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#9ca3af",
    cursor: "not-allowed",
    userSelect: "none",
  };

  return (
    <S.Card>
      <S.Title>MEU PERFIL</S.Title>

      <S.AvatarRow>
        <S.AvatarWrapper>
          <S.Avatar $imageUrl={avatarUrl}>
            {!avatarUrl && <Camera size={26} />}
          </S.Avatar>
          <S.AvatarEditButton
            type="button"
            onClick={handleTrocarFoto}
            aria-label="Trocar foto"
          >
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
            E-mail institucional
            <S.Input value={form.email} readOnly style={disabledStyle} />
          </S.Field>

          <S.Field>
            Perfil de acesso
            <S.Input
              value={role === "professor" ? "Professor / Orientador" : "Aluno"}
              readOnly
              style={disabledStyle}
            />
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

        <S.Field>
          Sobre mim
          <S.TextArea
            value={form.sobreMim}
            onChange={handleField("sobreMim")}
            placeholder="Conte um pouco sobre você, suas habilidades e interesses no TCC..."
          />
        </S.Field>

        {erro && <span style={{ color: "red", fontSize: "14px", marginTop: "10px", display: "block" }}>{erro}</span>}

        <S.FooterRow>
          <S.SaveButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
          </S.SaveButton>
          <S.SavedMessage $visible={salvo}>Alterações salvas!</S.SavedMessage>
        </S.FooterRow>
      </form>
    </S.Card>
  );
}