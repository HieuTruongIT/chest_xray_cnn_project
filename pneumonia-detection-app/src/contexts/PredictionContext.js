import React, { createContext, useContext, useState } from 'react';

const PredictionContext = createContext();

export const usePrediction = () => useContext(PredictionContext);

export const PredictionProvider = ({ children }) => {
  const [prediction, setPrediction] = useState(null);

  return (
    <PredictionContext.Provider value={{ prediction, setPrediction }}>
      {children}
    </PredictionContext.Provider>
  );
};

