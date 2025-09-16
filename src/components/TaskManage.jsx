import React, { useEffect, useState } from 'react';
import axios from '../axiosInstance.js';
import './TaskTable.css';
import TaskAddModal from './TaskAddModal'; 

const TaskManage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [showAddModal,setShowAddModal] = useState(false);
  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0];
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(formattedDate);
  const [selectedTeacher, setSelectedTeacher] = useState('봉유리');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 8;
  const [editingRow, setEditingRow] = useState(null);
  const [editingCell, setEditingCell] = useState({ id: null, field: null });
  const teachers = ['봉유리', '이제영', '강승화', '김남해', '변경진'];

  useEffect(() => {
    const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
        fetchTasks(selectedTeacher, date);
      }
  }, [selectedTeacher, date]);

  const fetchTasks = (teacherName, selectedDate) => {
    axios
      .get('/task/get_tasks', {
        params: { name: teacherName, date: selectedDate },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTasks(res.data);
        } else {
          setTasks([]);
        }
        setCurrentPage(1);
      })
      .catch((err) => {
        console.error('에러 발생:', err);
        setTasks([]);
      });
  };

  const handleDeleteTask = (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    axios
      .get(`/task/delete?id=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(() => {
        fetchTasks(selectedTeacher, date); // 목록 새로고침
      })
      .catch((err) => {
        console.error(err);
      });
  };

  //인라인 수정
  const handleInlineChange = (id, field, value) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks); // 상태만 업데이트
  };

  // 저장 버튼 눌렀을 때 전체 저장 (DB 저장 ⭕)
  const handleSaveAll = () => {
    Promise.all(
      tasks.map((task) =>
        axios.post(`/task/update?id=${task.id}`, task, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      )
    )
      .then(() => {
        alert("저장 완료!");
        fetchTasks(selectedTeacher, date); // 새로고침
      })
      .catch((err) => {
        console.error("저장 실패:", err);
        alert("저장 중 오류 발생!");
      });
  };

  //새로운 데이터 추가
  const handleAddEmptyTask = () => {
    axios.post(
      '/task/create',
      {
        test: '-',
        studentName: '-',
        time: '-',
        arrivalTime: '-',
        todo: '-',
        homework: '-',
        date,
        teacherName: selectedTeacher
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    ).then(() => {
      fetchTasks(selectedTeacher, date); // 새 목록 불러오기
    }).catch(err => {
      console.error(err);
    });
  };


  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  return (
    <section className="table-section">
      <div className="container">
        <div className="teacher-buttons mb-3">
          {teachers.map((teacher) => (
            <button
              key={teacher}
              className={`btn btn-sm me-2 ${selectedTeacher === teacher ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={() => setSelectedTeacher(teacher)}
            >
              {teacher}
            </button>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3"> 
          <input
            type="date"
            className="form-control form-control-sm"
            style={{ maxWidth: '200px' }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

         <div className="d-flex ms-auto">
          <button className="btn btn-sm btn-primary me-2" onClick={() => setShowAddModal(true)}>
            불러오기
          </button>
          <button className="btn btn-sm btn-primary" onClick={handleSaveAll}>
            저장
          </button>
         </div>
          
        </div>

       
        <div className="table-wrapper table-responsive">
          <table className="table table-hover text-center">
            <thead className="table-head">
              <tr>
                <th>테스트</th>
                <th>학생 이름</th>
                <th>시간</th>
                <th>도착시간</th>
                <th>할일</th>
                <th>숙제</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.length > 0 ? (
                currentTasks.map((task) => (
                  <tr key={task.id}>
                    {['test', 'studentName', 'time', 'arrivalTime', 'todo', 'homework'].map((field) => (
                        <td
                            key={field}
                            onClick={() => setEditingCell({ id: task.id, field })}
                        >
                            {editingCell?.id === task.id && editingCell.field === field ? (
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                value={task[field] || ''}
                                onChange={(e) => handleInlineChange(task.id, field, e.target.value)}
                                onBlur={(e) => {
                                  setEditingCell(null);
                                  handleInlineChange(task.id, field, e.target.value, true);
                                  }
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleInlineChange(task.id, field, e.target.value, true);
                                        setEditingCell(null);
                                    }
                                    }}
                                autoFocus
                            />
                            ) : (
                            task[field] || ''
                            )}
                        </td>
                        ))}
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          x
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleAddEmptyTask}
                >
                  ＋ 
                </button>
              </td>
            </tr>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination mt-3 d-flex justify-content-center">
            <button
              className="btn btn-outline-dark btn-sm me-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              이전
            </button>
            <span>페이지 {currentPage} / {totalPages}</span>
            <button
              className="btn btn-outline-dark btn-sm ms-2"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              다음
            </button>
          </div>
        )}
        {showAddModal && (
          <TaskAddModal
            selectedTeacher={selectedTeacher}
            date={date}
            onClose={() => setShowAddModal(false)}
            onSaved={() => fetchTasks(selectedTeacher, date)}
          />
        )}
        {editingRow && (
          <div className="edit-popup">
            <h5>수정: {editingRow.studentName}</h5>
            <input
              type="text"
              value={editingRow.test}
              onChange={(e) => handleChange('test', e.target.value)}
            />
            <input
              type="text"
              value={editingRow.time}
              onChange={(e) => handleChange('time', e.target.value)}
            />
            <input
              type="text"
              value={editingRow.arrivalTime}
              onChange={(e) => handleChange('arrivalTime', e.target.value)}
            />
            <input
              type="text"
              value={editingRow.todo}
              onChange={(e) => handleChange('todo', e.target.value)}
            />
            <input
              type="text"
              value={editingRow.homework}
              onChange={(e) => handleChange('homework', e.target.value)}
            />
            <div className="mt-2">
              <button className="btn btn-sm btn-primary me-2" onClick={handleSave}>저장</button>
              <button className="btn btn-sm btn-secondary" onClick={() => setEditingRow(null)}>취소</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TaskManage;
