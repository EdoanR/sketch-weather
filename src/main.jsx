import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import preloadImageAssets from './preload';

preloadImageAssets();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);
