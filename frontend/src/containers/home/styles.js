import styled from 'styled-components';

export const PlaceholderCard = styled.div`
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 40px;
  color: ${({ theme }) => theme.colors.textMuted};

  h1 {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1.4rem;
    margin-bottom: 8px;
  }
`;