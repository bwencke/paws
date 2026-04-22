import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { bootstrapOAuthRedirect } from '../lib/supabase';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element #root not found');
}

void bootstrapOAuthRedirect().then(() => {
  createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});