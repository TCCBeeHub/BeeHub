import { useState } from 'react';
import { Check, Users, ListChecks, UploadCloud, MessageCircle } from 'lucide-react';
import { grupos } from '../../data/gruposMock';
import * as S from './styles';

// Assumindo o grupo do aluno logado como o primeiro do mock, até existir
// uma associação real usuário → grupo vinda de um back-end.
const meuGrupo = grupos[0];

const ETAPAS_INICIAIS = [
  { id: 'tema', titulo: 'Tema definido', descricao: 'Escolha e aprovação do tema com o orientador', concluida: true },
  { id: 'intro', titulo: 'Introdução', descricao: 'Justificativa, objetivos e problema de pesquisa', concluida: true },
  { id: 'dev', titulo: 'Desenvolvimento', descricao: 'Metodologia e execução do projeto/protótipo', concluida: false },
  { id: 'resultados', titulo: 'Resultados e discussão', descricao: 'Análise dos dados/resultados obtidos', concluida: false },
  { id: 'revisao', titulo: 'Revisão do orientador', descricao: 'Ajustes solicitados pelo professor/orientador', concluida: false },
  { id: 'entrega', titulo: 'Entrega final', descricao: 'Envio da versão definitiva do TCC', concluida: false },
];

const DOCUMENTOS_INICIAIS = {
  arquivoCientifico: { label: 'Arquivo Científico', valor: '', enviado: false },
  projeto: { label: 'Projeto', valor: '', enviado: false },
  slide: { label: 'Slide', valor: '', enviado: false },
};

export function Projetos() {
  const [etapas, setEtapas] = useState(ETAPAS_INICIAIS);
  const [documentos, setDocumentos] = useState(DOCUMENTOS_INICIAIS);

  const concluidas = etapas.filter((e) => e.concluida).length;
  const progresso = Math.round((concluidas / etapas.length) * 100);

  const toggleEtapa = (id) => {
    setEtapas((prev) =>
      prev.map((etapa) => (etapa.id === id ? { ...etapa, concluida: !etapa.concluida } : etapa)),
    );
  };

  const handleDocValor = (chave) => (e) => {
    setDocumentos((prev) => ({
      ...prev,
      [chave]: { ...prev[chave], valor: e.target.value },
    }));
  };

  const handleEnviar = (chave) => (e) => {
    e.preventDefault();
    // Simulado: só marca como "enviado ao professor", sem back-end ainda.
    setDocumentos((prev) => ({
      ...prev,
      [chave]: { ...prev[chave], enviado: true },
    }));
  };

  return (
    <div>
      <S.PageHeader>
        <h1>MEUS PROJETOS</h1>
        <S.CourseTag $color={meuGrupo.cor}>
          {meuGrupo.curso} · {meuGrupo.nome}
        </S.CourseTag>
      </S.PageHeader>

      <S.Layout>
        <S.Column>
          {/* Etapas do TCC — passo a passo do desenvolvimento */}
          <S.Card>
            <S.CardTitle>
              <ListChecks size={18} />
              Etapas do TCC
            </S.CardTitle>

            <S.ProgressTrack>
              <S.ProgressFill $percent={progresso} />
            </S.ProgressTrack>
            <S.ProgressLabel>
              {concluidas} de {etapas.length} etapas concluídas ({progresso}%)
            </S.ProgressLabel>

            <S.StepList>
              {etapas.map((etapa) => (
                <S.StepRow key={etapa.id} onClick={() => toggleEtapa(etapa.id)}>
                  <S.StepCheck $done={etapa.concluida}>
                    {etapa.concluida && <Check size={13} />}
                  </S.StepCheck>
                  <span>
                    <S.StepTitle $done={etapa.concluida}>{etapa.titulo}</S.StepTitle>
                    <S.StepDesc>{etapa.descricao}</S.StepDesc>
                  </span>
                </S.StepRow>
              ))}
            </S.StepList>
          </S.Card>

          {/* Entregar ao professor — onde o grupo sobe os documentos */}
          <S.Card>
            <S.CardTitle>
              <UploadCloud size={18} />
              Entregar ao professor
            </S.CardTitle>

            <S.DeliverRow>
              {Object.entries(documentos).map(([chave, doc]) => (
                <S.DeliverField key={chave}>
                  <S.DeliverLabel>
                    {doc.label}
                    <S.DeliverStatus $sent={doc.enviado}>
                      {doc.enviado ? 'Enviado' : 'Pendente'}
                    </S.DeliverStatus>
                  </S.DeliverLabel>
                  <form onSubmit={handleEnviar(chave)}>
                    <S.DeliverInputRow>
                      <S.DeliverInput
                        value={doc.valor}
                        onChange={handleDocValor(chave)}
                        placeholder="Cole o link do arquivo (Drive, GitHub, etc.)"
                      />
                      <S.DeliverButton type="submit">
                        {doc.enviado ? 'Reenviar' : 'Enviar'}
                      </S.DeliverButton>
                    </S.DeliverInputRow>
                  </form>
                </S.DeliverField>
              ))}
            </S.DeliverRow>
          </S.Card>
        </S.Column>

        <S.Column>
          {/* Meu grupo */}
          <S.Card>
            <S.CardTitle>
              <Users size={18} />
              Meu grupo
            </S.CardTitle>
            <S.GroupMeta>Orientador(a): {meuGrupo.orientador || 'Não definido'}</S.GroupMeta>
            <S.TagList>
              {meuGrupo.participantes.map((nome) => (
                <S.Tag key={nome}>{nome}</S.Tag>
              ))}
            </S.TagList>
          </S.Card>

          {/* Comentários do orientador — só leitura aqui */}
          <S.Card>
            <S.CardTitle>
              <MessageCircle size={18} />
              Comentários do orientador
            </S.CardTitle>
            {meuGrupo.comentarios.length > 0 ? (
              meuGrupo.comentarios.map((c, i) => (
                <S.CommentItem key={i}>
                  <S.CommentAuthor>
                    {c.autor}
                    <S.CommentDate>{c.data}</S.CommentDate>
                  </S.CommentAuthor>
                  <S.CommentText>{c.texto}</S.CommentText>
                </S.CommentItem>
              ))
            ) : (
              <S.EmptyText>Nenhum comentário do orientador ainda.</S.EmptyText>
            )}
          </S.Card>
        </S.Column>
      </S.Layout>
    </div>
  );
}