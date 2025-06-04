import React, { useContext, useState } from "react";
import { useSegmentationController } from "../../controllers/segmentation/useSegmentationController";
import { UploadContext } from "../../contexts/UploadContext";
import html2canvas from "html2canvas";
import downloadIcon from "../../assets/logo_download.png";
import "../../styles/SegmentationView.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const SegmentationView = () => {
  const segmentations = useSegmentationController();
  const { previewImages } = useContext(UploadContext);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: "" });

  const handleDownloadAll = () => {
    const container = document.getElementById("segmentation-container");
    if (!container) return;
    html2canvas(container).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "segmentation_results.png";
      link.click();
    });
  };

  const showTooltip = (e, label) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltip({
      visible: true,
      x,
      y,
      text: `X: ${Math.round(x)}, Y: ${Math.round(y)} - ${label}`,
    });
  };

  const hideTooltip = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  return (
    <div className="segmentation-container" id="segmentation-container">
      {segmentations.length === 0 ? (
        <div className="no-data">No data to display</div>
      ) : (
        segmentations.map((item, index) => (
          <div key={index} className="segmentation-item">
            <TransformWrapper>
              <TransformComponent>
                <div
                  className="segmentation-image"
                  onMouseMove={(e) => showTooltip(e, "Ảnh gốc")}
                  onMouseLeave={hideTooltip}
                >
                  <img src={previewImages[index]} alt={`Original ${index}`} />
                  {tooltip.visible && (
                    <div
                      className="tooltip"
                      style={{ top: tooltip.y, left: tooltip.x, position: "absolute" }}
                    >
                      {tooltip.text}
                    </div>
                  )}
                </div>
              </TransformComponent>
            </TransformWrapper>

            <TransformWrapper>
              <TransformComponent>
                <div
                  className="segmentation-image"
                  onMouseMove={(e) => showTooltip(e, "Mask")}
                  onMouseLeave={hideTooltip}
                >
                  {item.maskBase64 ? (
                    <img src={`data:image/png;base64,${item.maskBase64}`} alt={`Mask ${index}`} />
                  ) : (
                    <p>Không có ảnh segmentation cho ảnh {index + 1}.</p>
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
              </TransformComponent>
            </TransformWrapper>
          </div>
        ))
      )}
      {segmentations.length > 0 && (
        <button className="save-button" onClick={handleDownloadAll}>
          <img src={downloadIcon} alt="download icon" />
          Lưu toàn bộ kết quả
        </button>
      )}
    </div>
  );
};

export default SegmentationView;
