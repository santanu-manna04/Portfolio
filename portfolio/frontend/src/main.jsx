import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
        <Toaster position="top-right" toastOptions={{ style: { background: 'var(--surface-solid)', color: 'var(--text)', border: '1px solid var(--border)' } }} />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
