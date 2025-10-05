import App from './App';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
