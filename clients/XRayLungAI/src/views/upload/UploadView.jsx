import React, { useState, useContext } from "react";
import { useUploadController } from "../../controllers/upload/useUploadController";
import { UploadContext } from "../../contexts/UploadContext";
import "../../styles/UploadView.css";

const UploadView = () => {
  const { uploadImages, loading, uploadProgress } = useUploadController();
  const {
    files,
    previewImages,
    addFiles,
    addImageURL,
    resetUpload,
    removeImage,
  } = useContext(UploadContext);

  const [urlInput, setUrlInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    addFiles(newFiles);
  };

  const handleAddURL = async () => {
    if (urlInput.trim() !== "") {
      await addImageURL(urlInput.trim());
      setUrlInput("");
    }
  };

  const handleUpload = async () => {
    if (files.length > 0) {
      await uploadImages();
    }
  };

  const closeModal = () => setSelectedImage(null);

  return (
    <div className="upload-container">
      <h1 className="upload-header">Upload ảnh X-quang để phân tích</h1>

      <div className="upload-section">
        <label>Chọn ảnh từ máy:</label><br />
        <input type="file" accept="image/*" multiple onChange={handleFileChange} className="file-input" />
      </div>

      <div className="upload-section">
        <label>Hoặc thêm ảnh từ URL:</label><br />
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Nhập URL ảnh"
          className="url-input"
        />
        <button onClick={handleAddURL} className="button">Thêm ảnh từ URL</button>
      </div>

      <div className="preview-grid">
        {files.map((item, idx) => (
          <div key={idx} className="preview-item">
            <div className="preview-wrapper">
              <img
                src={item.preview}
                alt={`preview-${idx}`}
                onClick={() => setSelectedImage(item.preview)}
              />
              <button className="remove-btn" onClick={() => removeImage(idx)}>✕</button>
            </div>
            <p><strong>Ảnh {idx + 1}</strong></p>
            <p>Nguồn: {item.source === "URL" ? "Internet" : "Thiết bị"}</p>
          </div>
        ))}
      </div>

      <div className="image-summary">
        <h3 className="summary-title">Tổng ảnh đã chọn: {previewImages.length} Ảnh</h3>
        <div className="summary-grid">
          <div className="summary-header">Tên ảnh</div>
          <div className="summary-header">Kích thước</div>
          <div className="summary-header">Định dạng</div>
          <div className="summary-header">Nguồn</div>

          {files.map((item, idx) => {
            const fullName = item.source === "URL" ? `pneumonia ${idx + 1}` : item.file.name;
            const nameOnly = fullName.replace(/\.[^/.]+$/, "");
            const typeOnly = item.file.type.split("/").pop();  

            return (
              <React.Fragment key={idx}>
                <div className="summary-cell">{nameOnly}</div>
                <div className="summary-cell">{(item.file.size / 1024).toFixed(1)} KB</div>
                <div className="summary-cell">{typeOnly}</div>
                <div className="summary-cell">{item.source === "URL" ? "Internet" : "Thiết bị"}</div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
          <p>Đang xử lý: {uploadProgress}%</p>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleUpload}
          disabled={loading || files.length === 0}
          className="button"
        >
          {loading ? "Đang phân tích..." : "Phân tích"}
        </button>
        <button
          onClick={resetUpload}
          className="button secondary"
          style={{ marginLeft: "10px" }}
        >
          Xóa tất cả
        </button>
      </div>

      {selectedImage && (
        <div className="lightbox-overlay" onClick={closeModal}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>✕</button>
            <img src={selectedImage} alt="Preview lớn" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadView;
