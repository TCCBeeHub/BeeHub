import styled from 'styled-components';

export const Wrapper = styled.aside`
  position: fixed;
  top: ${({ theme }) => theme.layout.headerHeight};
  left: 0;
  bottom: 0;
  width: ${({ $collapsed, theme }) =>
    $collapsed ? theme.layout.sidebarCollapsedWidth : theme.layout.sidebarWidth};
  background: ${({ theme }) => theme.colors.bgSurface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 14px;
  transition: width 0.2s ease;
  z-index: 90;
`;

export const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  width: 100%;
  text-align: left;
  color: ${({ $active, theme }) => ($active ? theme.colors.textPrimary : theme.colors.textMuted)};
  background: ${({ $active, theme }) => ($active ? theme.colors.accentDim : 'transparent')};
  box-shadow: ${({ $active, theme }) => ($active ? theme.shadow.glow : 'none')};
  transition: background 0.15s ease, color 0.15s ease;
  position: relative;

  svg {
    flex: 0 0 auto;
  }

  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.colors.accentDim : theme.colors.bgSurfaceAlt)};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const NavLabel = styled.span`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  transition: opacity 0.15s ease;
`;

export const Badge = styled.span`
  margin-left: auto;
  font-size: 0.72rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: ${({ theme }) => theme.radius.pill};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.accentBright};
  color: ${({ theme }) => theme.colors.bgVoid};
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
`;

export const CollapseButton = styled.button`
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transform: rotate(${({ $collapsed }) => ($collapsed ? '180deg' : '0deg')});
  transition: transform 0.2s ease, color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accentBright};
  }
`;