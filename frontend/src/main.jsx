import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import App from "./App.jsx";
import { theme } from "./styles/theme.js";
import { GlobalStyles } from "./styles/globalStyles.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider as PortalThemeProvider } from "./context/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <PortalThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </PortalThemeProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
