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
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 2.5rem;
`;

export const GridCursos = styled.div`
  display: grid;
  /* Cria colunas automaticamente se adaptando ao espaço (minímo de 220px por cartão) */
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
`;

export const CursoCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 2px solid transparent; /* A cor da borda vem pelo style inline no componente */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px); /* Faz o card 'pular' suavemente para cima */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

export const IconWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 50%;
`;

export const CursoNome = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  line-height: 1.4;
  flex-grow: 1; /* Garante que os botões fiquem alinhados caso os nomes tenham tamanhos diferentes */
`;

export const CursoButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  background-color: #f3f4f6;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e5e7eb;
    color: #111827;
  }
`;