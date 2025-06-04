import React, { useContext, useRef, useState } from "react";
import { useDetectionController } from "../../controllers/detection/useDetectionController";
import { UploadContext } from "../../contexts/UploadContext";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import html2canvas from "html2canvas";
import warningIcon from "../../assets/logo_waringSign.png";
import downloadIcon from "../../assets/logo_download.png";
import filterIcon from "../../assets/logo_filter.png";
import "../../styles/DetectionView.css";

const DetectionView = () => {
  const detections = useDetectionController();
  const { previewImages } = useContext(UploadContext);
  const resultRef = useRef(null);

  const COLORS = {
    NORMAL: "#4caf50",
    PNEUMONIA: "#f44336",
  };

  const [filterLabel, setFilterLabel] = useState("ALL");
  const [showFilterSelect, setShowFilterSelect] = useState(false);

  const handleDownload = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current);
    const link = document.createElement("a");
    link.download = "detection_results.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const toggleFilterSelect = () => {
    setShowFilterSelect((prev) => !prev);
  };

  const filteredDetections =
    filterLabel === "ALL"
      ? detections
      : detections.filter((item) => item.label === filterLabel);

  return (
    <div className="detection-container">
      {filteredDetections.length > 0 && (
        <div className="top-controls">
          <button className="download-button" onClick={handleDownload}>
            <img src={downloadIcon} alt="download icon" />
            Tải toàn bộ kết quả
          </button>

          <div className="group-button-container">
            <button className="group-button" onClick={toggleFilterSelect}>
              <img src={filterIcon} alt="filter icon" />
              Phân nhóm ảnh theo kết quả
            </button>

            {showFilterSelect && (
              <select
                value={filterLabel}
                onChange={(e) => setFilterLabel(e.target.value)}
                className="group-select"
              >
                <option value="ALL">ALL</option>
                <option value="NORMAL">NORMAL</option>
                <option value="PNEUMONIA">PNEUMONIA</option>
              </select>
            )}
          </div>
        </div>
      )}

      {filteredDetections.length === 0 ? (
        <div className="no-data">No data to display</div>
      ) : (
        <div ref={resultRef}>
          {filteredDetections.map((item) => {
            const originalIndex = detections.indexOf(item);
            const confidenceValue = item.confidence * 100;

            const pieData =
              item.label === "NORMAL"
                ? [
                    { name: "NORMAL", value: parseFloat(confidenceValue.toFixed(2)) },
                    { name: "PNEUMONIA", value: parseFloat((100 - confidenceValue).toFixed(2)) },
                  ]
                : [
                    { name: "NORMAL", value: parseFloat((100 - confidenceValue).toFixed(2)) },
                    { name: "PNEUMONIA", value: parseFloat(confidenceValue.toFixed(2)) },
                  ];

            return (
              <div key={originalIndex} className="detection-item">
                <div className="detection-image-container">
                  <p className="image-label">Ảnh đã tải</p>
                  <img
                    src={previewImages[originalIndex]}
                    alt={`Original ${originalIndex}`}
                    className="detection-image"
                  />
                </div>
                <div className="detection-chart-container">
                  <div className="chart-layout">
                    <PieChart width={300} height={300}>
                      <Pie
                        data={pieData}
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        stroke="none"
                      >
                        {pieData.map((entry, i) => (
                          <Cell
                            key={`cell-${i}`}
                            fill={entry.name === "NORMAL" ? COLORS.NORMAL : COLORS.PNEUMONIA}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>

                    <div className="result-text">
                      <p className="result-title">Kết quả phân loại</p>
                      <p
                        className={`detection-result ${
                          item.label === "NORMAL" ? "label-normal" : "label-pneumonia"
                        }`}
                      >
                        <span>
                          {item.label.toUpperCase()} - Độ tin cậy: {confidenceValue.toFixed(2)}%
                        </span>
                        {item.label === "PNEUMONIA" && (
                          <img src={warningIcon} alt="Warning" className="warning-icon" />
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DetectionView;
