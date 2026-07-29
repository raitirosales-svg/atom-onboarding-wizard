import React from 'react';
import { createRoot } from 'react-dom/client';
import { ReactFlowProvider } from '@xyflow/react';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './i18n';

createRoot(document.getElementById('root')!).render(
  <ReactFlowProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </ReactFlowProvider>
);
