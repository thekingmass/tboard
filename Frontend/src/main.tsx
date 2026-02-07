import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './main.css';
import App from './App.tsx';
import { AuthProvider } from './auth/AuthContext.tsx';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Toaster richColors position="top-right" />
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
