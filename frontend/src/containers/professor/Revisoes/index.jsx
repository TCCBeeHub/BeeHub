import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, FileText, ArrowUpRight } from "lucide-react";
import * as S from "./styles";

// Função auxiliar que lê os arquivos "enviados" pelos alunos no localStorage
function arquivosDoGrupo(groupId) {
  try {
    const saved =
      JSON.parse(localStorage.getItem("beehub-arquivos") || "{}")[groupId] || {};
    return Object.values(saved).filter((file) => file?.enviado);
  } catch {
    return [];
  }
}

// Recebe os grupos reais do professor via props
export function Revisoes({ grupos }) {
  const navigate = useNavigate();

  const pendencias = useMemo(() => {
    if (!grupos) return [];
    
    return grupos
      .map((grupo) => {
        const arquivosLocais = arquivosDoGrupo(grupo.idGrupo);
        return {
          ...grupo,
          arquivos: arquivosLocais,
        };
      })
      // Mostra apenas grupos que tenham arquivos enviados (se quiser mostrar todos, remova o .filter)
      .filter((grupo) => grupo.arquivos.length > 0);
  }, [grupos]);

  return (
    <S.Page>
      <S.Header>
        <div>
          <S.Kicker>PROFESSOR</S.Kicker>
          <h1>REVISÕES</h1>
          <p>Materiais enviados pelos grupos que precisam ser conferidos.</p>
        </div>
        <S.Count>
          <ClipboardCheck size={16} /> {pendencias.length} grupo(s)
        </S.Count>
      </S.Header>

      {pendencias.length ? (
        <S.Grid>
          {pendencias.map((grupo) => (
            <S.Card key={grupo.idGrupo}>
              <S.CardTop>
                <div>
                  <strong>{grupo.nomeGrupo}</strong>
                  <span>
                    {/* Busca o tema se o TCC estiver atrelado ao grupo (opcional no front) */}
                    {grupo.tcc?.tema || "Tema ainda não informado"}
                  </span>
                </div>
                <S.FileCount>
                  <FileText size={14} />
                  {grupo.arquivos.length}
                </S.FileCount>
              </S.CardTop>
              <S.CardInfo>
                {grupo.orientacao?.curso?.nome || "Curso"} · {(grupo.alunos || []).length} participante(s)
              </S.CardInfo>
              <S.Action onClick={() => navigate(`/revisao/${grupo.idGrupo}`)}>
                Abrir revisão <ArrowUpRight size={15} />
              </S.Action>
            </S.Card>
          ))}
        </S.Grid>
      ) : (
        <S.Empty>
          <ClipboardCheck size={30} />
          <strong>Nenhum arquivo pendente</strong>
          <span>
            Quando os alunos enviarem materiais, eles aparecerão aqui.
          </span>
        </S.Empty>
      )}
    </S.Page>
  );
}