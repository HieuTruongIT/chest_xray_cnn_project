import React, { useEffect, useRef, useState } from "react";
import { usePrediction } from "../../contexts/PredictionContext";
import { useAuth } from "../../contexts/AuthContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logopneumonia from '../../assets/logo_pneumonia_nocolor.png';
import "../../styles/ReportView.css";

const ReportView = () => {
  const { predictionResult } = usePrediction();
  const { user } = useAuth();
  const reportRef = useRef();
  const [userProfile, setUserProfile] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(true);
  const [saving, setSaving] = useState(false);

  const severityList = Array.isArray(predictionResult?.severity)
    ? predictionResult.severity.map((item, index) => ({
        id: index,
        geographicExtent: item?.geographic_extent?.toFixed(2) || "0.00",
        opacity: item?.opacity?.toFixed(2) || "0.00",
        saliencyMapBase64: item?.saliency_map_base64 || null,
      }))
    : [];

  const detections = predictionResult?.detection || [];
  const segmentations = predictionResult?.segmentation || [];

  useEffect(() => {
    if (!user || !showProfilePopup) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/v1/users/get/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-User-UID": user.uid,
          },
        });

        if (!response.ok) throw new Error("Không thể tải hồ sơ người dùng");

        const data = await response.json();
        setUserProfile({
          name: data.name || "",
          age: data.age?.toString() || "",
          gender: data.gender || "",
          birthdate: data.birthdate || "",
          address: data.address || "",
          bloodType: data.bloodType || "",
          height: data.height?.toString() || "",
          weight: data.weight?.toString() || "",
          medicalHistory: Array.isArray(data.medicalHistory) ? data.medicalHistory.join(", ") : "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          uid: user.uid,
        });
      } catch (err) {
        console.error(err);
        alert("Không thể tải hồ sơ người dùng");
      }
    };

    fetchProfile();
  }, [showProfilePopup, user]);

  const exportPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("bao_cao_benh_an.pdf");
    });
  };

  const saveReport = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để lưu báo cáo");
      return;
    }
    setSaving(true);
    try {
      const input = reportRef.current;
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfBase64 = pdf.output("datauristring").split(",")[1];

      const reportName = `bao_cao_benh_an_${new Date().toISOString().slice(0,10)}.pdf`;

      const response = await fetch("http://localhost:8082/api/v1/report/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-UID": user.uid,
        },
        body: JSON.stringify({
          fileName: reportName,
          pdfBase64: pdfBase64,
        }),
      });


      if (!response.ok) {
        throw new Error("Lưu báo cáo thất bại");
      }

      
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi lưu báo cáo");
    } finally {
      setSaving(false);
    }
  };

  if (!predictionResult) return <p className="no-data">no data to display.</p>;
  if (!userProfile) return <p>Đang tải thông tin người dùng...</p>;

  return (
    <div className="report-wrapper">
      <div className="report-header">
        <button className="export-button" onClick={exportPDF}>📄 Xuất PDF</button>
        <button className="save-button" onClick={saveReport} disabled={saving}>
          {saving ? "Đang lưu..." : "💾 Lưu PDF"}
        </button>
      </div>

      <div ref={reportRef} className="report-container">
        <div className="header-container">
          <img src={logopneumonia} alt="bệnh án" />
          <h2 className="report-title">Báo Cáo Bệnh Án Nội Khoa Hô Hấp</h2>
        </div>

        <div className="patient-info">
          <h3>I. Thông Tin Bệnh Nhân</h3>
          <div className="info-grid">
            <div className="info-row"><strong>Họ tên:</strong> {userProfile.name}</div>
            <div className="info-row"><strong>Email:</strong> {userProfile.email}</div>
            {userProfile.phoneNumber && (
              <div className="info-row"><strong>Số điện thoại:</strong> {userProfile.phoneNumber}</div>
            )}
            <div className="info-row"><strong>Tuổi:</strong> {userProfile.age}</div>
            <div className="info-row"><strong>Giới tính:</strong> {userProfile.gender}</div>
            <div className="info-row"><strong>Ngày sinh:</strong> {userProfile.birthdate}</div>
            <div className="info-row"><strong>Địa chỉ:</strong> {userProfile.address}</div>
            <div className="info-row"><strong>Nhóm máu:</strong> {userProfile.bloodType}</div>
            <div className="info-row"><strong>Chiều cao:</strong> {userProfile.height} cm</div>
            <div className="info-row"><strong>Cân nặng:</strong> {userProfile.weight} kg</div>
            <div className="info-row"><strong>Tiền sử bệnh:</strong> {userProfile.medicalHistory}</div>
          </div>
        </div>

        <div className="report-section">
          <h3>II. Kết Quả Chuẩn Đoán - Detection</h3>
          {detections.length > 0 ? (
            detections.map((item, index) => (
              <div key={index} className="report-card">
                <p><strong>Vùng #{index + 1}</strong></p>
                <p><strong>Dự Đoán:</strong> {item.label || "Không rõ"}</p>
                <p><strong>Xác Xuất Dự Đoán:</strong> {item.confidence ? `${(item.confidence * 100).toFixed(2)}%` : "Không rõ"}</p>
              </div>
            ))
          ) : (
            <p>Không có dữ liệu phân loại.</p>
          )}
        </div>

        <div className="report-section">
          <h3>III. Vùng Phân Đoạn Hình Ảnh - Segmentation</h3>
          {segmentations.length > 0 ? (
            segmentations.map((item, index) => (
              <div key={index} className="report-card">
                <p><strong>Vùng #{index + 1}</strong></p>
                {item.mask_base64 ? (
                  <img
                    src={`data:image/png;base64,${item.mask_base64}`}
                    alt={`Mask ${index + 1}`}
                    style={{ width: "200px", border: "1px solid #ccc" }}
                  />
                ) : (
                  <p>Không có hình ảnh phân đoạn.</p>
                )}
              </div>
            ))
          ) : (
            <p>Không có dữ liệu phân đoạn.</p>
          )}
        </div>

        <div className="report-section">
          <h3>IV. Mức Độ Nghiêm Trọng - Severity</h3>
          {severityList.length > 0 ? (
            severityList.map((sev) => (
              <div key={sev.id} className="report-card">
                <p><strong>Geographic Extent:</strong> {sev.geographicExtent}</p>
                <p><strong>Opacity:</strong> {sev.opacity}</p>
                {sev.saliencyMapBase64 ? (
                  <img
                    src={`data:image/png;base64,${sev.saliencyMapBase64}`}
                    alt="Saliency Map"
                    style={{ width: "200px", border: "1px solid #ccc" }}
                  />
                ) : (
                  <p>Không có hình ảnh saliency map.</p>
                )}
              </div>
            ))
          ) : (
            <p>Không có dữ liệu mức độ nghiêm trọng.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportView;
