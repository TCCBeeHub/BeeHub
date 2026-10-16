import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.font.body};
    color: var(--portal-ink, #282331);
    background: var(--portal-page, #f7f6f3);
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4 {
    font-family: ${({ theme }) => theme.font.display};
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  button, input, textarea {
    font-family: inherit;
    color: inherit;
    border: none;
    outline: none;
    background: none;
  }

  button {
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul, ol {
    list-style: none;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.borderStrong};
    border-radius: 999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;
