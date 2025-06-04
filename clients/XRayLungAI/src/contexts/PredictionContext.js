import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"; 

export const PredictionContext = createContext();

export const PredictionProvider = ({ children }) => {
  const [predictionResult, setPredictionResult] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (predictionResult && user?.uid) {
      savePredictionResult(predictionResult, user.uid);
    }
  }, [predictionResult, user]);

  const savePredictionResult = async (result, uid) => {
    console.log(" Đang gửi prediction:", result, "với UID:", uid);
    try {
      const response = await fetch("http://localhost:8084/api/v1/results/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-UID": uid,  
        },
        body: JSON.stringify({ prediction: result }),
      });

      const data = await response.json();
      console.log("Phản hồi server:", response.status, data);

      if (!response.ok) {
        console.error("Lưu thất bại:", data);
      } else {
        console.log("Lưu thành công!");
      }
    } catch (error) {
      console.error("Lỗi fetch:", error);
    }
  };

  return (
    <PredictionContext.Provider value={{ predictionResult, setPredictionResult }}>
      {children}
    </PredictionContext.Provider>
  );
};


export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error("usePrediction must be used within a PredictionProvider");
  }
  return context;
};
