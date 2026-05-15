import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    font-family: ${({ theme }) => theme.font.family};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4 { margin: 0; font-weight: 700; }
  button { font-family: inherit; cursor: pointer; }
  input, button { font-size: 1rem; }
  a { color: inherit; }
`;
