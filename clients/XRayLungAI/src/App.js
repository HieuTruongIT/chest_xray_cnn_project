import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { PredictionProvider } from './contexts/PredictionContext';
import { UploadProvider } from './contexts/UploadContext'; 

function App() {
  return (
    <PredictionProvider>
      <UploadProvider>
        <AppRoutes />
      </UploadProvider>
    </PredictionProvider>
  );
}

export default App;  
