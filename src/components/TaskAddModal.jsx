import React, { useState } from 'react';
import axios from 'axios';
import './TaskTable.css';

const TaskAddModal = ({ selectedTeacher, date, onClose, onSaved }) => {
  const [copyDate, setCopyDate] = useState('');

  const handleCopyTasks = () => {
    if (!copyDate) {
      alert('복사할 날짜를 선택해주세요.');
      return;
    }

    // 1. 복사할 날짜의 task 가져오기
    axios
      .get('http://localhost:8080/task/get_tasks', {
        params: { name: selectedTeacher, date: copyDate },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(async (res) => {
        if (!res.data || res.data.length === 0) {
          return;
        }

        // 2. 가져온 데이터들을 현재 날짜(date)로 저장
        for (const task of res.data) {
          const { id, ...rest } = task; // 기존 id 제거
          await axios.post(
            'http://localhost:8080/task/create',
            {
              ...rest,
              date: date,
              name: selectedTeacher
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
        }

        alert('할 일을 복사했습니다.');
        onSaved();  // 목록 갱신
        onClose();  // 모달 닫기
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h5 className="mbr-section-title mb-3">📋 다른 날짜에서 불러오기</h5>
        <p className="mbr-text small">선택한 날짜의 할 일을 불러와 현재 날짜에 복사합니다.</p>

        <input
          type="date"
          className="form-control form-control-sm mb-3"
          value={copyDate}
          onChange={(e) => setCopyDate(e.target.value)}
        />

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-sm btn-success" onClick={handleCopyTasks}>
            불러오기
          </button>
          <button className="btn btn-sm btn-secondary" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskAddModal;
