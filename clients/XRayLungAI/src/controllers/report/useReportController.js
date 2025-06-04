import { useContext } from "react";
import { PredictionContext } from "../../contexts/PredictionContext";

export const useReportController = () => {
  const { predictionResult } = useContext(PredictionContext);

  const detectionList = Array.isArray(predictionResult?.detection)
    ? predictionResult.detection
    : [];
  const severityList = Array.isArray(predictionResult?.severity)
    ? predictionResult.severity
    : [];
  const segmentationList = Array.isArray(predictionResult?.segmentation)
    ? predictionResult.segmentation
    : [];

  return detectionList.map((item, index) => ({
    id: index,
    label: item.label || "UNKNOWN",
    confidence: item.confidence?.toFixed(2) || "0.00",
    geographicExtent: severityList[index]?.geographic_extent?.toFixed(2) || "N/A",
    opacity: severityList[index]?.opacity?.toFixed(2) || "N/A",
    mask: segmentationList[index]?.mask_base64 || null,
    saliency: severityList[index]?.saliency_map_base64 || null,
  }));
};
