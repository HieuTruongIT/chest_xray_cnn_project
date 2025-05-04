import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import { PredictionProvider } from './contexts/PredictionContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PredictionProvider>
    <App />
  </PredictionProvider>
);
