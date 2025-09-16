import React, { useState } from "react";
import axios from "../axiosInstance.js";
import PrintOptionsModal from "./PrintOptionsModal";

function PrintForm() {
  const [semester, setSemester] = useState("1-1");
  const [selectedBook, setSelectedBook] = useState(null);
  const [sectionRanges, setSectionRanges] = useState({});
  const [selectedSubs, setSelectedSubs] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [printOptions, setPrintOptions] = useState(null);

  const bookOptions = {
    "1-1": ['라쎈', '개정라쎈', '쎈', '일품', '개정쎈', 'RPM', '개정RPM'],
    "1-2": ['라이트쎈', '쎈', '일품'],
    "2-1": ['라이트쎈', '쎈', 'RPM'],
    "2-2": ['쎈', '일품', '개정RPM'],
    "3-1": ['쎈', '일품'],
    "3-2": ['쎈', '일품'],
  };

  const toggleSub = (chapter, sub) => {
    setSelectedSubs((prev) => {
      const current = prev[chapter] || [];
      return {
        ...prev,
        [chapter]: current.includes(sub)
          ? current.filter((s) => s !== sub)
          : [...current, sub],
      };
    });
  };

  const handleBookSelect = async (book) => {
    setSelectedBook(book);
    setSelectedSubs({});
    setSectionRanges({});
    try {
      const res = await axios.get("/print/get", {
        params: { name: `${semester}/${book}` },
      });
      setSectionRanges(res.data.sectionRanges || {});
    } catch (message) {
      console.error("섹션 범위 불러오기 실패:", message);
      
    }
  };

  const handleSubmit = async () => {
    if (!selectedBook || !printOptions) return;

    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const printSections = {};
    const finalSectionRanges = {};

    Object.entries(selectedSubs).forEach(([chapter, subs]) => {
      if (subs.length > 0) {
        printSections[chapter] = subs;
        finalSectionRanges[chapter] = {};
        subs.forEach((sub) => {
          finalSectionRanges[chapter][sub] = sectionRanges[chapter][sub];
        });
      }
    });

    const payload = {
      name: `${semester}/${selectedBook}`,
      filePath: `/pdfs/${semester}/${selectedBook}.pdf`,
      printSections,
      sectionRanges: finalSectionRanges,
      ...printOptions,
    };

    try {
      const res = await axios.post("/print/print_out", payload
      );
      alert(`인쇄 요청 완료: ${res.data.message || res.data}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.error("인쇄 요청 실패:", err);
    }
  };

  return (
    <div className="print-form-container" style={{ maxWidth: 1000, margin: "60px auto", padding: 30 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>📄 PDF 인쇄 요청</h2>

      {/* 학기 선택 */}
      <div className="mb-3">
        <label htmlFor="semesterSelect" style={{ fontWeight: "bold" }}>학기 선택:</label>
        <select
          id="semesterSelect"
          value={semester}
          onChange={(e) => {
            setSemester(e.target.value);
            setSelectedBook(null);
            setSectionRanges({});
            setSelectedSubs({});
          }}
          className="form-select"
          style={{ marginLeft: "10px", width: "200px", display: "inline-block" }}
        >
          {Object.keys(bookOptions).map((sem) => (
            <option key={sem} value={sem}>{sem.replace("-", "학년 ") + "학기"}</option>
          ))}
        </select>
      </div>

      {/* 교재 선택 */}
      {bookOptions[semester] && (
        <div className="book-buttons mb-3">
          <div style={{ marginBottom: 10, fontWeight: "bold" }}>교재 선택:</div>
          {bookOptions[semester].map((book) => (
            <button
              key={book}
              onClick={() => handleBookSelect(book)}
              className={`btn btn-outline-primary me-2 mb-2 ${selectedBook === book ? 'active' : ''}`}
            >
              {book}
            </button>
          ))}
        </div>
      )}

      {/* 범위 선택 */}
      {selectedBook && Object.keys(sectionRanges).length > 0 && (
        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">선택된 교재: <strong>{selectedBook}</strong></h4>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>인쇄</button>
          </div>
          <div className="chapter-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {Object.entries(sectionRanges).map(([chapter, subs]) => (
              <div key={chapter} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", background: "#fafafa" }}>
                <h5>{chapter}</h5>
                {Object.entries(subs).map(([sub, range]) => (
                  <label key={sub} className="d-block mb-1">
                    <input
                      type="checkbox"
                      checked={selectedSubs[chapter]?.includes(sub) || false}
                      onChange={() => toggleSub(chapter, sub)}
                      style={{ marginRight: "8px" }}
                    />
                    {sub} ({range.start} ~ {range.end})
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 인쇄 옵션 모달 */}
      <PrintOptionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(options) => {
          setPrintOptions(options);
          handleSubmit();
        }}
      />
    </div>
  );
}

export default PrintForm;
