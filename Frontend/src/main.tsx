import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './Router/router.tsx';
import { AuthProvider } from './auth/AuthContext.tsx';
import { Toaster } from 'sonner';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { appTheme } from './theme.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AuthProvider>
        <Toaster richColors position="top-right" duration={3000}/>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
