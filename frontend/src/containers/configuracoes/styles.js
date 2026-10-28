import styled from "styled-components";
export const Page = styled.div`
  max-width: 1020px;
  margin: 0 auto;
`;
export const Title = styled.h1`
  font-size: 1.35rem;
`;
export const Subtitle = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 5px 0 20px;
`;
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;
export const Card = styled.section`
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 20px;
`;
export const CardTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  margin-bottom: 16px;
  svg {
    color: ${({ theme }) => theme.colors.accentBright};
  }
`;
export const ToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  div {
    display: flex;
    flex-direction: column;
    strong {
      font-size: 0.8rem;
    }
    span {
      font-size: 0.69rem;
      color: ${({ theme }) => theme.colors.textMuted};
      margin-top: 4px;
      line-height: 1.4;
    }
  }
`;
export const Toggle = styled.button`
  width: 42px;
  height: 24px;
  padding: 3px;
  border-radius: 999px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.accentDim : theme.colors.bgSurfaceAlt};
  flex: 0 0 auto;
  span {
    display: block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.textPrimary};
    transform: translateX(${({ $active }) => ($active ? "18px" : "0")});
    transition: transform 0.15s;
  }
`;
export const Info = styled.div`
  padding: 11px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;
export const Preview = styled.div`
  margin-top: 14px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgVoid};
  display: flex;
  flex-direction: column;
  span {
    font-family: ${({ theme }) => theme.font.display};
    font-weight: 700;
  }
  small {
    color: ${({ theme }) => theme.colors.textFaint};
    margin-top: 4px;
    font-size: 0.68rem;
  }
`;
export const SecurityLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  div {
    display: flex;
    flex-direction: column;
    strong {
      font-size: 0.8rem;
    }
    span {
      font-size: 0.69rem;
      color: ${({ theme }) => theme.colors.textMuted};
      margin-top: 4px;
      line-height: 1.4;
    }
  }
`;
export const ActionButton = styled.button`
  padding: 8px 11px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.69rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;
export const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
`;
export const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 15px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 700;
  font-size: 0.72rem;
`;
export const Saved = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.success};
`;
