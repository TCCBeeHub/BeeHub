import { useMemo, useState } from "react";
import { MessageCircle, Search, Send, UserCircle } from "lucide-react";
import * as S from "./styles";

const CONVERSAS_INICIAIS = [
  {
    id: 1,
    nome: "Prof. Marcos Andrade",
    assunto: "Orientação · Desenvolvimento",
    mensagens: [
      {
        autor: "professor",
        texto: "Revise a metodologia antes de avançar para os resultados.",
        hora: "14:20",
      },
      { autor: "aluno", texto: "Perfeito, vou atualizar hoje.", hora: "14:32" },
    ],
  },
  {
    id: 2,
    nome: "Bruno Lima",
    assunto: "Equipe · Sistema de Gestão",
    mensagens: [
      {
        autor: "bruno",
        texto: "Subi a nova versão da documentação.",
        hora: "12:08",
      },
    ],
  },
  {
    id: 3,
    nome: "Secretaria TCC",
    assunto: "Avisos",
    mensagens: [
      {
        autor: "secretaria",
        texto: "A entrega da próxima etapa fica disponível até sexta-feira.",
        hora: "09:10",
      },
    ],
  },
];

export function Conversas() {
  const [conversas, setConversas] = useState(CONVERSAS_INICIAIS);
  const [selecionada, setSelecionada] = useState(1);
  const [busca, setBusca] = useState("");
  const [texto, setTexto] = useState("");
  const atual = conversas.find((c) => c.id === selecionada);
  const filtradas = useMemo(
    () =>
      conversas.filter((c) =>
        `${c.nome} ${c.assunto}`.toLowerCase().includes(busca.toLowerCase()),
      ),
    [conversas, busca],
  );

  const enviar = (e) => {
    e.preventDefault();
    if (!texto.trim() || !atual) return;
    setConversas((prev) =>
      prev.map((c) =>
        c.id === selecionada
          ? {
              ...c,
              mensagens: [
                ...c.mensagens,
                {
                  autor: "aluno",
                  texto: texto.trim(),
                  hora: new Date().toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ],
            }
          : c,
      ),
    );
    setTexto("");
  };

  return (
    <S.Page>
      <S.TitleRow>
        <div>
          <h1>CONVERSAS</h1>
          <p>
            Fale com orientadores, colegas e equipe administrativa sem sair do
            BeeHub.
          </p>
        </div>
        <S.MessageCount>
          <MessageCircle size={17} /> {conversas.length} conversas
        </S.MessageCount>
      </S.TitleRow>
      <S.ChatLayout>
        <S.Inbox>
          <S.SearchBox>
            <Search size={15} />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar conversa..."
            />
          </S.SearchBox>
          {filtradas.map((c) => (
            <S.ConversationButton
              key={c.id}
              $active={c.id === selecionada}
              onClick={() => setSelecionada(c.id)}
            >
              <S.PersonIcon>
                <UserCircle size={20} />
              </S.PersonIcon>
              <div>
                <strong>{c.nome}</strong>
                <span>{c.assunto}</span>
              </div>
            </S.ConversationButton>
          ))}
        </S.Inbox>
        <S.Chat>
          {atual && (
            <>
              <S.ChatHeader>
                <div>
                  <strong>{atual.nome}</strong>
                  <span>{atual.assunto}</span>
                </div>
                <S.Online>● ativo</S.Online>
              </S.ChatHeader>
              <S.MessageList>
                {atual.mensagens.map((m, i) => (
                  <S.Bubble key={i} $mine={m.autor === "aluno"}>
                    <span>{m.texto}</span>
                    <small>{m.hora}</small>
                  </S.Bubble>
                ))}
              </S.MessageList>
              <S.Compose onSubmit={enviar}>
                <input
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Escreva sua mensagem..."
                />
                <button type="submit" aria-label="Enviar">
                  <Send size={17} />
                </button>
              </S.Compose>
            </>
          )}
        </S.Chat>
      </S.ChatLayout>
    </S.Page>
  );
}
