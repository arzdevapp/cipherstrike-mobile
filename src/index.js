import React from 'react';
import ReactDOM from 'react-dom/client';
import CipherStrike from './CipherStrike';

// Capacitor core — handles native bridge
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Initialize Capacitor PWA elements (optional but recommended)
defineCustomElements(window);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CipherStrike />
  </React.StrictMode>
);
