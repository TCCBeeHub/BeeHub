import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
`;

export const Title = styled.h1`
  font-size: 1.875rem;
  color: #111827;
  margin-bottom: 2rem;
  font-weight: 700;
`;

export const SuporteLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr; /* Coluna do FAQ maior, coluna de contato menor */
  gap: 2rem;

  /* Responsividade: vira uma coluna só em telas menores */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FaqSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ContatoSection = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  height: fit-content; /* A caixa de contato fica só do tamanho do texto dela */
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: #374151;
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem; /* Espaço entre o ícone e o texto */
`;

export const FaqItem = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

export const FaqQuestion = styled.div`
  padding: 1.25rem;
  font-weight: 500;
  color: #1f2937;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9fafb;
  
  span {
    font-size: 1.25rem;
    color: #6b7280;
    font-weight: 600;
  }
`;

export const FaqAnswer = styled.div`
  padding: 1.25rem;
  color: #4b5563;
  line-height: 1.6;
  border-top: 1px solid #e5e7eb;
  background-color: #ffffff;
  animation: slideDown 0.3s ease-out;

  /* Efeito suave ao abrir a resposta */
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const Paragraph = styled.p`
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

export const ContactBox = styled.div`
  background-color: #f3f4f6;
  padding: 1.25rem;
  border-radius: 8px;
  color: #374151;
  font-size: 0.95rem;
  line-height: 1.8;

  strong {
    color: #111827;
  }
`;