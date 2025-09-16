
import React, { useEffect, useState } from "react";
import axios from "../axiosInstance.js";

function PrintManager() {
  const [prints, setPrints] = useState([]);      // 왼쪽 목록
  const [selected, setSelected] = useState(null); // 오른쪽 상세

  // 데이터 불러오기
  const fetchPrints = async () => {
    try {
      const res = await axios.get("/print/get-all");
      setPrints(res.data);
    } catch (err) {
      console.error("불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchPrints();
  }, []);

  // 목록 추가
  const handleAdd = async () => {
    try {
      const res = await axios.post("/print/create", {
        name: "학년-학기/책이름",
        filePath: "",
        sectionRanges: {
          "1단원": {
              "chapter1": { "start": 1, "end": 3 },
              "chapter2": { "start": 4, "end": 6 }
            },
            "부록": {
              "appendix1": { "start": 10, "end": 12 }
            }
        },
      });
      fetchPrints();
      setSelected(res.data); // 방금 추가한 항목 상세로 띄우기
    } catch (err) {
      console.error("추가 실패:", err);
    }
  };

  const handleSelect = async (id) => {
    try {
      const res = await axios.get(`/print/getbyid?id=${id}`);

      setSelected({
        ...res.data,
        sectionRanges: typeof res.data.sectionRanges === 'string'
          ? res.data.sectionRanges
          : JSON.stringify(res.data.sectionRanges, null, 2),
      });
    } catch (err) {
      console.error("상세 가져오기 실패:", err);
    }
  };

  // 저장
  const handleSave = async () => {
    if (!selected) return;
    try {

      const bodyToSend = {
        ...selected, sectionRanges : JSON.parse(selected.sectionRanges)
      }
      await axios.post(`/print/update?id=${selected.id}`, bodyToSend);

      fetchPrints();
    } catch (err) {
      console.error("저장 실패:", err);
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.get(`/print/delete?id=${selected.id}`);
      setSelected(null);
      fetchPrints();
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  return (
    <div className="d-flex" style={{ height: "600px" }}>
      {/* 왼쪽 박스: 문제 목록 */}
      <div
        style={{
          flex: 1,
          borderRight: "1px solid #ddd",
          padding: "15px",
          overflowY: "auto",
        }}
      >
        <h5>문제 목록</h5>
        <ul className="list-group">
          {prints.map((p) => (
            <li
              key={p.id}
              className={`list-group-item ${
                selected?.id === p.id ? "active" : ""
              }`}
              onClick={() => handleSelect(p.id)}
              style={{ cursor: "pointer" }}
            >
              {p.name}
            </li>
          ))}
          <li className="list-group-item text-center">
            <button className="btn btn-sm btn-outline-primary" onClick={handleAdd}>
              ＋ 추가
            </button>
          </li>
        </ul>
      </div>

      {/* 오른쪽 박스: 상세 정보 */}
      <div style={{ flex: 2, padding: "20px" }}>
        {selected ? (
          <>
            <h5>문제 상세</h5>
            
            <div className="mb-3">
              <label>이름</label>
              <input
                className="form-control"
                value={selected.name}
                onChange={(e) =>
                  setSelected({ ...selected, name: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label>파일 경로</label>
              <input
                className="form-control"
                value={selected.filePath}
                onChange={(e) =>
                  setSelected({ ...selected, filePath: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label>섹션 범위 (JSON)</label>
              <textarea
                className="form-control"
                rows="6"
                value={selected.sectionRanges}
                onChange={(e) =>
                  setSelected({ ...selected, sectionRanges: e.target.value })
                }
              />
            </div>
            <div>
              <button className="btn btn-success me-2" onClick={handleSave}>
                저장
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                삭제
              </button>
            </div>
          </>
        ) : (
          <div className="text-muted">왼쪽에서 문제를 선택하세요.</div>
        )}
      </div>
    </div>
  );
}

export default PrintManager;
