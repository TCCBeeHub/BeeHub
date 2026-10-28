import styled from "styled-components";
export const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;
export const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
  h1 {
    font-size: 1.45rem;
    margin-top: 5px;
  }
  p {
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-top: 5px;
  }
`;
export const Kicker = styled.span`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.accentBright};
`;
export const Count = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 11px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
`;
export const Card = styled.article`
  padding: 18px;
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`;
export const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  > div {
    display: flex;
    flex-direction: column;
    strong {
      font-size: 0.9rem;
    }
    span {
      font-size: 0.72rem;
      color: ${({ theme }) => theme.colors.textMuted};
      margin-top: 3px;
      line-height: 1.35;
    }
  }
`;
export const FileCount = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.accentBright};
  font-size: 0.7rem;
`;
export const CardInfo = styled.p`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textFaint};
  margin: 15px 0;
`;
export const Action = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  justify-content: center;
  padding: 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.75rem;
  font-weight: 700;
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;
export const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  padding: 70px 20px;
  color: ${({ theme }) => theme.colors.textFaint};
  strong {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.9rem;
  }
  span {
    font-size: 0.75rem;
  }
`;
