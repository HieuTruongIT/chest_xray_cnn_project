import { useContext, useState } from "react";
import axios from "axios";
import { PredictionContext } from "../../contexts/PredictionContext";
import { UploadContext } from "../../contexts/UploadContext";

const API_BASE = "http://localhost:8000/api/v1/chest_xray_cnn_project";

export const useUploadController = () => {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { setPredictionResult } = useContext(PredictionContext);
  const { files } = useContext(UploadContext);

  const uploadImages = async () => {
    if (!files.length) return;

    setLoading(true);
    setUploadProgress(0);
    const formData = new FormData();
    files.forEach((item) => formData.append("files", item.file));

    try {
      const [detectionRes, severityRes, segmentationRes] = await Promise.all([
        axios.post(`${API_BASE}/predict_pneumonia_detection`, formData, {
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(percent);
          },
        }),
        axios.post(`${API_BASE}/predict_pneumonia_severity`, formData),
        axios.post(`${API_BASE}/predict_pneumonia_segmentation`, formData, {
          responseType: "json",
        }),
      ]);

      const result = {
        detection: detectionRes.data.results,
        severity: severityRes.data.results,
        segmentation: segmentationRes.data.results,
      };

      setPredictionResult(result);
    } catch (error) {
      console.error("Lỗi khi upload hoặc gọi API:", error);
    } finally {
      setLoading(false);
      setUploadProgress(100);
    }
  };

  return { uploadImages, loading, uploadProgress };
};
