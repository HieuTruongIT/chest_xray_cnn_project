import React, { useEffect, useState } from "react";
import { FiEye, FiDownload, FiEdit2, FiTrash2 } from "react-icons/fi";
import { saveAs } from "file-saver";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/MyReportView.css";

const MyReportView = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [renameModal, setRenameModal] = useState({ visible: false, reportId: null, currentName: "" });
  const [deleteModal, setDeleteModal] = useState({ visible: false, reportId: null });
  const [newFileName, setNewFileName] = useState("");

  const [toast, setToast] = useState(null); 

  useEffect(() => {
    if (!user) return;

    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8082/api/v1/report/myreport", {
          headers: {
            "X-User-UID": user.uid,
          },
        });
        if (!res.ok) throw new Error("Lấy dữ liệu báo cáo thất bại");
        const data = await res.json();
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  const Toast = ({ message, type = "info", onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }, [onClose]);

    return (
      <div className={`toast toast-${type}`}>
        {message}
      </div>
    );
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const onView = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const onDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Tải file thất bại");
      const blob = await response.blob();
      saveAs(blob, fileName);
      showToast("Tải file thành công", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const openRenameModal = (id, currentName) => {
    setRenameModal({ visible: true, reportId: id, currentName });
    setNewFileName(currentName);
  };

  const confirmRename = () => {
    const { reportId } = renameModal;
    if (!newFileName.trim()) {
      showToast("Tên mới không được để trống", "error");
      return;
    }

    fetch(`http://localhost:8082/api/v1/report/rename/${reportId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-User-UID": user.uid,
      },
      body: JSON.stringify({ newFileName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Đổi tên thất bại");
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, fileName: newFileName } : r))
        );
        showToast("Đổi tên thành công", "success");
        setRenameModal({ visible: false, reportId: null, currentName: "" });
      })
      .catch((err) => showToast(err.message, "error"));
  };

  const cancelRename = () => {
    setRenameModal({ visible: false, reportId: null, currentName: "" });
  };

  const openDeleteModal = (id) => {
    setDeleteModal({ visible: true, reportId: id });
  };

  const confirmDelete = () => {
    const { reportId } = deleteModal;

    fetch(`http://localhost:8082/api/v1/report/delete/${reportId}`, {
      method: "DELETE",
      headers: {
        "X-User-UID": user.uid,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Xóa báo cáo thất bại");
        setReports((prev) => prev.filter((r) => r.id !== reportId));
        showToast("Xóa thành công", "success");
        setDeleteModal({ visible: false, reportId: null });
      })
      .catch((err) => showToast(err.message, "error"));
  };

  const cancelDelete = () => {
    setDeleteModal({ visible: false, reportId: null });
  };

  if (loading) return <p className="loading-text">Đang tải dữ liệu...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="my-report-container">
      <table className="report-table">
        <thead>
          <tr>
            <th>Tên báo cáo</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report) => (
              <tr key={report.id}>
                <td>{report.fileName}</td>
                <td>{report.createdAt}</td>
                <td>{report.status}</td>
                <td className="action-buttons">
                  <button title="Xem" onClick={() => onView(report.fileUrl)} className="btn-action btn-view">
                    <FiEye />
                  </button>
                  <button title="Tải xuống" onClick={() => onDownload(report.fileUrl, report.fileName)} className="btn-action btn-download">
                    <FiDownload />
                  </button>
                  <button title="Đổi tên" onClick={() => openRenameModal(report.id, report.fileName)} className="btn-action btn-rename">
                    <FiEdit2 />
                  </button>
                  <button title="Xóa" onClick={() => openDeleteModal(report.id)} className="btn-action btn-delete">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-reports">
                Không có báo cáo nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal đổi tên */}
      {renameModal.visible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Đổi tên báo cáo</h3>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Nhập tên mới"
              autoFocus
              className="input-rename"
            />
            <div className="modal-actions">
              <button onClick={confirmRename} className="btn-confirm">Xác nhận</button>
              <button onClick={cancelRename} className="btn-cancel">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xóa */}
      {deleteModal.visible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc muốn xóa báo cáo này?</p>
            <div className="modal-actions">
              <button onClick={confirmDelete} className="btn-confirm">Xóa</button>
              <button onClick={cancelDelete} className="btn-cancel">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default MyReportView;
