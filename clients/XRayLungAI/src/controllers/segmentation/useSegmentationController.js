import { useContext } from "react";
import { PredictionContext } from "../../contexts/PredictionContext";

export const useSegmentationController = () => {
  const { predictionResult } = useContext(PredictionContext);
  const segmentations = predictionResult?.segmentation || [];

  return segmentations.map((item, index) => ({
    id: index,
    maskBase64: item?.mask_base64 || null,
  }));
};
