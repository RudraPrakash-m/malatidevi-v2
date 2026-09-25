import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { store } from '@/app/store';
import { ThemeProvider, useTheme, getMuiTheme, StatusModalProvider } from '@/config/theme';

interface AppProvidersProps {
  children: React.ReactNode;
}

const MuiThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const muiTheme = getMuiTheme(theme);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <StatusModalProvider>
        <BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            toastStyle={{ zIndex: 9999 }}
          />
          {children}
        </BrowserRouter>
      </StatusModalProvider>
    </MuiThemeProvider>
  );
};

export const AppProviders: React.FC<Readonly<AppProvidersProps>> = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <MuiThemeWrapper>
          {children}
        </MuiThemeWrapper>
      </ThemeProvider>
    </Provider>
  );
};

export default AppProviders;
