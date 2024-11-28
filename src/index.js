import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/app.css';
import App from './App.jsx';
import reportWebVitals from './utils/reportWebVitals';
import "bootstrap/dist/css/bootstrap.css";
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

function ThemedApp() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemedApp />
  </React.StrictMode>
);

reportWebVitals();
