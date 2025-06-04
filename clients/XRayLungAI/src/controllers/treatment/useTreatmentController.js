import { useContext } from "react";
import { PredictionContext } from "../../contexts/PredictionContext";

export const useTreatmentController = () => {
  const { predictionResult } = useContext(PredictionContext);
  const detectionList = Array.isArray(predictionResult?.detection)
    ? predictionResult.detection
    : [];

  // Giả sử: nếu là PNEUMONIA thì đưa gợi ý điều trị, nếu NORMAL thì không
  return detectionList.map((item, index) => {
    const label = item.label || "UNKNOWN";
    const confidence = item.confidence?.toFixed(2) || "0.00";
    const suggestion =
      label === "PNEUMONIA"
        ? "Khuyến nghị khám bác sĩ, xét nghiệm CRP, dùng kháng sinh nếu là vi khuẩn."
        : "Không phát hiện viêm phổi. Theo dõi triệu chứng nếu có.";

    return {
      id: index,
      label,
      confidence,
      suggestion,
    };
  });
};
