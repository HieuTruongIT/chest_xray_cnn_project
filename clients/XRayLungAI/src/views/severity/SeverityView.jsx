import React, { useContext, useState } from "react";
import { useSeverityController } from "../../controllers/severity/useSeverityController";
import { UploadContext } from "../../contexts/UploadContext";
import { evaluateSeverity } from "../../utils/severityUtils";
import html2canvas from "html2canvas";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import downloadIcon from "../../assets/logo_download.png";
import "../../styles/SeverityView.css";
const SeverityView = () => {
  const severityList = useSeverityController();
  const { previewImages } = useContext(UploadContext);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: "" });

  const handleDownloadAll = () => {
    const container = document.getElementById("severity-container");
    if (!container) return;
    html2canvas(container).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "severity_result.png";
      link.click();
    });
  };

  const showTooltip = (e, label) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTooltip({
      visible: true,
      x: x + 10,
      y: y - 20,
      text: `X: ${Math.round(x)}, Y: ${Math.round(y)} - ${label}`,
    });
  };

  const hideTooltip = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  if (!severityList || severityList.length === 0) {
    return (
      <div className="severity-container no-data">
        <p>No data to display</p>
      </div>
    );
  }

  return (
    <div className="severity-container" id="severity-container">
      <button className="save-button" onClick={handleDownloadAll}>
        <img src={downloadIcon} alt="download icon" />
        Lưu toàn bộ kết quả
      </button>

      {severityList.map((item, index) => {
        const { geographicGrade, opacityGrade, overallSeverity } =
          evaluateSeverity(item.geographicExtent, item.opacity);

        return (
          <div key={index} className="severity-item">
            {/* Ảnh gốc */}
            <div
              className="severity-image-original"
              onMouseMove={(e) => showTooltip(e, "Ảnh gốc")}
              onMouseLeave={hideTooltip}
            >
              <TransformWrapper>
                <TransformComponent>
                  <img src={previewImages[index]} alt={`Original ${index}`} />
                </TransformComponent>
              </TransformWrapper>
              {tooltip.visible && (
                <div
                  className="tooltip"
                  style={{ top: tooltip.y, left: tooltip.x, position: "absolute" }}
                >
                  {tooltip.text}
                </div>
              )}
            </div>

            {/* Heatmap */}
            <div
              className="severity-image-heatmap"
              onMouseMove={(e) => showTooltip(e, "Heatmap")}
              onMouseLeave={hideTooltip}
            >
              {item.saliencyMapBase64 ? (
                <TransformWrapper>
                  <TransformComponent>
                    <img
                      src={`data:image/png;base64,${item.saliencyMapBase64}`}
                      alt={`Heatmap ${index}`}
                    />
                  </TransformComponent>
                </TransformWrapper>
              ) : (
                <div className="no-heatmap">Không có heatmap</div>
              )}
              {tooltip.visible && (
                <div
                  className="tooltip"
                  style={{ top: tooltip.y, left: tooltip.x, position: "absolute" }}
                >
                  {tooltip.text}
                </div>
              )}
            </div>

            {/* Thông tin severity */}
            <div className="severity-info">
              <p><strong>Ảnh {index + 1}</strong></p>

              <div className="bar-legend">* Điểm đánh giá từ 0 đến 8</div>

              <div className="bar-label">Geographic Extent</div>
              <div className="bar-wrapper">
                <div className="bar-fill bar-blue" style={{ width: `${(item.geographicExtent / 8) * 100}%` }}>
                  {item.geographicExtent}
                </div>
              </div>

              <div className="bar-label">Opacity</div>
              <div className="bar-wrapper">
                <div className="bar-fill bar-orange" style={{ width: `${(item.opacity / 8) * 100}%` }}>
                  {item.opacity}
                </div>
              </div>

              <p><strong>Overall Severity: {overallSeverity}</strong></p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SeverityView;
