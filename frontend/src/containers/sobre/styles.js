import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 2rem;
  max-width: 800px; /* Largura contida para facilitar a leitura */
  margin: 0 auto;
  width: 100%;
`;

export const Title = styled.h1`
  font-size: 1.875rem;
  color: #111827;
  margin-bottom: 2rem;
  font-weight: 700;
`;

export const ContentCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: #374151;
  margin-bottom: 1rem;
  font-weight: 600;
  margin-top: 2rem;

  &:first-child {
    margin-top: 0;
  }
`;

export const Paragraph = styled.p`
  color: #4b5563;
  line-height: 1.7;
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: justify;
`;