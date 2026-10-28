import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, FileText, ArrowUpRight } from "lucide-react";
import { grupos } from "../../../data/gruposMock";
import * as S from "./styles";

function arquivosDoGrupo(groupId, iniciais = []) {
  try {
    const saved =
      JSON.parse(localStorage.getItem("beehub-arquivos") || "{}")[groupId] ||
      {};
    const extras = Object.values(saved).filter((file) => file?.enviado);
    const nomes = new Set(iniciais.map((f) => f.nome));
    return [...iniciais, ...extras.filter((f) => !nomes.has(f.name))];
  } catch {
    return iniciais;
  }
}

export function Revisoes() {
  const navigate = useNavigate();
  const pendencias = useMemo(
    () =>
      grupos
        .map((grupo) => ({
          ...grupo,
          arquivos: arquivosDoGrupo(grupo.id, grupo.arquivosEnviados || []),
        }))
        .filter((grupo) => grupo.arquivos.length > 0),
    [],
  );

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
            <S.Card key={grupo.id}>
              <S.CardTop>
                <div>
                  <strong>{grupo.nome}</strong>
                  <span>{grupo.tema || "Tema ainda não informado"}</span>
                </div>
                <S.FileCount>
                  <FileText size={14} />
                  {grupo.arquivos.length}
                </S.FileCount>
              </S.CardTop>
              <S.CardInfo>
                {grupo.curso} · {grupo.participantes.length} participante(s)
              </S.CardInfo>
              <S.Action onClick={() => navigate(`/revisao/${grupo.id}`)}>
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
