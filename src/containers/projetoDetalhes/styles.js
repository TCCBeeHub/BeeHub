import styled from "styled-components";
export const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;
export const Back = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.76rem;
  &:hover {
    color: ${({ theme }) => theme.colors.accentBright};
  }
`;
export const Card = styled.article`
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 28px;
`;
export const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;
export const Course = styled.span`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.accentBright};
`;
export const Status = styled.span`
  padding: 5px 8px;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 0.65rem;
  font-weight: 700;
  background: ${({ $done, theme }) =>
    $done ? "rgba(52,211,153,.12)" : theme.colors.bgSurfaceAlt};
  color: ${({ $done, theme }) =>
    $done ? theme.colors.success : theme.colors.warning};
`;
export const Theme = styled.p`
  color: ${({ theme }) => theme.colors.accentBright};
  font-size: 0.88rem;
  margin: 6px 0 16px;
`;
export const Body = styled.p`
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.84rem;
`;
export const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 22px 0;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;
export const Meta = styled.div`
  display: flex;
  gap: 9px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border-radius: ${({ theme }) => theme.radius.md};
  svg {
    color: ${({ theme }) => theme.colors.accentBright};
    margin-top: 2px;
  }
  div {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  span {
    font-size: 0.62rem;
    color: ${({ theme }) => theme.colors.textFaint};
  }
  strong {
    font-size: 0.75rem;
  }
`;
export const Section = styled.section`
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  h2 {
    font-size: 0.88rem;
    margin-bottom: 10px;
  }
`;
export const Tags = styled.div`
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
`;
export const Tag = styled.span`
  padding: 6px 9px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  font-size: 0.67rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;
export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px;
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.73rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;
export const Empty = styled.div`
  min-height: 55vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textFaint};
  strong {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
  span {
    font-size: 0.75rem;
  }
`;
