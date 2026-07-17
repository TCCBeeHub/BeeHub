import styled from 'styled-components';

export const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${({ theme }) => theme.layout.headerHeight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: ${({ theme }) => theme.colors.bgSurface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 100;
`;

export const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
`;

export const LogoIconBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.accentBright};

  svg:last-child {
    position: absolute;
    width: 13px;
    height: 13px;
    color: ${({ theme }) => theme.colors.bgSurface};
    background: ${({ theme }) => theme.colors.accentBright};
    border-radius: 50%;
    padding: 1px;
  }
`;

export const LogoText = styled.span`
  font-family: ${({ theme }) => theme.font.display};
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const CenterNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 760px) {
    display: none;
  }
`;

export const NavButton = styled.button`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 9px 18px;
  border-radius: ${({ theme }) => theme.radius.pill};
  color: ${({ $active, theme }) => ($active ? theme.colors.textPrimary : theme.colors.textMuted)};
  background: ${({ $active, theme }) => ($active ? theme.colors.bgSurfaceAlt : 'transparent')};
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bgSurfaceAlt};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;
`;

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  color: ${({ theme }) => theme.colors.accentBright};
`;

export const UserName = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};

  @media (max-width: 560px) {
    display: none;
  }
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 9px 18px;
  border-radius: ${({ theme }) => theme.radius.pill};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.accentDim};
  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
  &:active {
    transform: scale(0.97);
  }
`;
