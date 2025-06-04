import { useContext } from "react";
import { PredictionContext } from "../../contexts/PredictionContext";

export const useDetectionController = () => {
  const { predictionResult } = useContext(PredictionContext);
  const detectionList = predictionResult?.detection || [];

  return detectionList.map((item, index) => ({
    id: index,
    label: item?.label || "Chưa có dữ liệu",
    confidence: item?.confidence || 0,
  }));
};
