import React, { useState } from "react";

function PrintOptionsModal({ isOpen, onClose, onSubmit }) {
  const [orientation, setOrientation] = useState("PORTRAIT");
  const [sides, setSides] = useState("ONE_SIDED");
  const [paperSize, setPaperSize] = useState("A4");

  const handleSubmit = () => {
    onSubmit({ orientation, sides, paperSize });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "30px",
          width: "400px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          animation: "fadeIn 0.3s ease-in-out",
        }}
      >
        <h3 style={{ marginBottom: "20px", textAlign: "center" }}>🖨️ 인쇄 옵션</h3>

        {/* 용지 방향 */}
        <div className="mb-3">
          <label style={{ fontWeight: "bold" }}>📄 용지 방향</label>
          <select
            className="form-select w-100"
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
          >
            <option value="PORTRAIT">세로</option>
            <option value="LANDSCAPE">가로</option>
          </select>
        </div>

        {/* 인쇄 방식 */}
        <div className="mb-3 mt-3">
          <label style={{ fontWeight: "bold" }}>📑 인쇄 방식</label>
          <select
            className="form-select w-100"
            value={sides}
            onChange={(e) => setSides(e.target.value)}
          >
            <option value="ONE_SIDED">단면</option>
            <option value="DUPLEX">양면</option>
            <option value="TUMBLE">양면(반대)</option>
          </select>
        </div>

        {/* 용지 크기 */}
        <div className="mb-4 mt-3">
          <label style={{ fontWeight: "bold" }}>📐 용지 크기</label>
          <select
            className="form-select w-100"
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value)}
          >
            <option value="A4">A4</option>
            <option value="B5">B5</option>
            <option value="LETTER">Letter</option>
          </select>
        </div>

        {/* 버튼 */}
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={onClose}>
            취소
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            인쇄 요청
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrintOptionsModal;
