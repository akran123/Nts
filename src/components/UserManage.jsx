
import React, { useEffect, useState } from "react";
import axios from "../axiosInstance.js";

function UserManager() {
  const [users, setUsers] = useState([]);      // 왼쪽 목록
  const [selected, setSelected] = useState(null); // 오른쪽 상세

  // 데이터 불러오기
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/user/get-all");
      setUsers(res.data);
    } catch (err) {
      console.error("불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 목록 추가
  const handleAdd = async () => {
    try {
      const res = await axios.post("/user/create", {
        name: "이름을 입력하세요",
        personalId: "아이디를 입력하세요",
        password: "비밀번호를 입력하세요",
        userClassification : "TEACHER"
      });
      fetchUsers();
      setSelected(res.data); // 방금 추가한 항목 상세로 띄우기
      alert("추가 완료")
    } catch (err) {
      console.error("추가 실패:", err);
    }
  };

  const handleSelect = async (id) => {
    try {
      const res = await axios.get(`/user/get?id=${id}`);

      setSelected(res.data);
    } catch (err) {
      console.error("상세 가져오기 실패:", err);
    }
  };

  // 저장
  const handleSave = async () => {
    if (!selected) return;
    try {
      await axios.post(`/user/update`, selected);
      fetchUsers();
      alert("수정 완료")
    } catch (err) {
      console.error("저장 실패:", err);
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.get(`/user/delete?name=${selected.name}`);
      setSelected(null);
      fetchUsers();
      alert("삭제 완료")
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
        <h5>사용자 목록</h5>
        <ul className="list-group">
          {users.map((p) => (
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
            <h5>사용자 세부 정보</h5>
            
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
              <label>id</label>
              <input
                className="form-control"
                value={selected.personalId}
                onChange={(e) =>
                  setSelected({ ...selected, personalId: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label>password</label>
              <input
                className="form-control"
                rows="1"
                value={selected.password}
                onChange={(e) =>
                  setSelected({ ...selected, password: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label>userClassification</label>
              <textarea
                className="form-control"
                rows="1"
                value={selected.userClassification}
                onChange={(e) =>
                  setSelected({ ...selected, userClassification: e.target.value })
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
          <div className="text-muted">사용자를 선택하세요.</div>
        )}
      </div>
    </div>
  );
}

export default UserManager;