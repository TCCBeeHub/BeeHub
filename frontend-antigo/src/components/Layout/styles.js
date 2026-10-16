import styled from 'styled-components';

export const Main = styled.main`
  margin-top: ${({ theme }) => theme.layout.headerHeight};
  margin-left: ${({ $collapsed, theme }) =>
    $collapsed ? theme.layout.sidebarCollapsedWidth : theme.layout.sidebarWidth};
  padding: 28px 32px 48px;
  min-height: ${({ theme }) => `calc(100vh - ${theme.layout.headerHeight})`};
  transition: margin-left 0.2s ease;

  @media (max-width: 900px) {
    padding: 20px 18px 40px;
  }
`;