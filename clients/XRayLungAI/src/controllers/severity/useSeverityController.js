import { useContext } from "react";
import { PredictionContext } from "../../contexts/PredictionContext";

export const useSeverityController = () => {
  const { predictionResult } = useContext(PredictionContext);
  const severities = Array.isArray(predictionResult?.severity)
    ? predictionResult.severity
    : [];

  return severities.map((item, index) => ({
    id: index,
    geographicExtent: item?.geographic_extent?.toFixed(2) || "0.00",
    opacity: item?.opacity?.toFixed(2) || "0.00",
    saliencyMapBase64: item?.saliency_map_base64 || null,
  }));
};
