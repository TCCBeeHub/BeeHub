import React, { useState } from 'react';
import { HelpCircle, Mail } from 'lucide-react';
import * as S from './styles'; // Crie um styles.js dentro desta pasta

export function Suporte() {
  const [perguntaAtiva, setPerguntaAtiva] = useState(null);

  const faq = [
    {
      pergunta: "Como faço para enviar a documentação do meu TCC?",
      resposta: "Acesse o painel inicial, clique em 'Meu Projeto' e utilize a área de upload. Apenas arquivos PDF são aceitos para a documentação final."
    },
    {
      pergunta: "Meu R.M. não está sendo reconhecido no login. O que fazer?",
      resposta: "Verifique se você selecionou a ETEC correta no menu. Caso o erro persista, procure a secretaria da sua unidade para confirmar seu cadastro."
    },
    {
      pergunta: "Como falo com meu orientador pelo sistema?",
      resposta: "Dentro da página do seu projeto, existe uma aba chamada 'Mensagens' onde você pode enviar dúvidas diretamente para o professor vinculado ao seu TCC."
    }
  ];

  const togglePergunta = (index) => {
    setPerguntaAtiva(perguntaAtiva === index ? null : index);
  };

  return (
    <S.PageContainer>
      <S.Title>Suporte e Ajuda</S.Title>
      
      <S.SuporteLayout>
        <S.FaqSection>
          <S.SectionTitle><HelpCircle size={20} /> Dúvidas Frequentes (FAQ)</S.SectionTitle>
          {faq.map((item, index) => (
            <S.FaqItem key={index} onClick={() => togglePergunta(index)}>
              <S.FaqQuestion>
                {item.pergunta}
                <span>{perguntaAtiva === index ? '-' : '+'}</span>
              </S.FaqQuestion>
              {perguntaAtiva === index && (
                <S.FaqAnswer>{item.resposta}</S.FaqAnswer>
              )}
            </S.FaqItem>
          ))}
        </S.FaqSection>

        <S.ContatoSection>
          <S.SectionTitle><Mail size={20} /> Ainda precisa de ajuda?</S.SectionTitle>
          <S.Paragraph>
            Se você encontrou algum bug no sistema ou não conseguiu resolver sua dúvida, entre em contato com os desenvolvedores.
          </S.Paragraph>
          <S.ContactBox>
            <strong>E-mail:</strong> suporte@beehub.com.br
            <br />
            <strong>Horário:</strong> Segunda a Sexta, das 08h às 18h
          </S.ContactBox>
        </S.ContatoSection>
      </S.SuporteLayout>
    </S.PageContainer>
  );
}