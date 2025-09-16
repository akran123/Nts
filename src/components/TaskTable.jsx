import React, { useEffect, useState } from 'react';
import axios from '../axiosInstance.js';
import './TaskTable.css';
import '../axiosInstance.js'


const TaskTable = () => {
  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0];

  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(formattedDate);
  const [selectedTeacher, setSelectedTeacher] = useState('봉유리');
  const [currentPage, setCurrentPage] = useState(1); // ✅ 현재 페이지
  const [editingCell, setEditingCell] = useState({ id: null, field: null });
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ 로그인 상태

  const tasksPerPage = 8; // ✅ 한 페이지에 보여줄 개수
  const teachers = ['봉유리', '이제영', '강승화', '김남해', '변경진'];

  // 데이터 가져오기
  const fetchTasks = (teacherName) => {
    axios
      .get('/task/get_tasks', {
        params: { name: teacherName, date: formattedDate}
      })
      .then((res) => {
        setTasks(res.data);
        setSelectedTeacher(teacherName);
        if (res.data.length > 0) {
          setDate(formattedDate);
        } else {
          setDate('');
        }
        setCurrentPage(1); // 새로 불러올 때 첫 페이지로 초기화
      })
      .catch((err) => console.error(err));
  };

  // ✅ 인라인 수정
  const handleInlineChange = (id, field, value, shouldSave = false) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks);

    if (shouldSave) {
      const updatedTask = updatedTasks.find((task) => task.id === id);

      axios
        .post(
          `/task/update?id=${id}`,
          updatedTask
        )
        .then(() => {
          console.log('저장 완료');
        })
        .catch((err) => {
          console.error('업데이트 실패:', err);
        });
    }
  }; // ✅ 함수 닫기

  // ✅ 초기 실행
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    fetchTasks(selectedTeacher);
  }, []);

  // ✅ 현재 페이지에 보여줄 데이터 계산
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  // ✅ 전체 페이지 수
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  return (
    <section className="table-section">
      <div className="container">
        {/* 선생님 선택 버튼 */}
        <div className="teacher-buttons mb-3">
          {teachers.map((teacher) => (
            <button
              key={teacher}
              className={`btn btn-sm me-2 ${
                selectedTeacher === teacher ? 'btn-dark' : 'btn-outline-dark'
              }`}
              onClick={() => fetchTasks(teacher)}
            >
              {teacher}
            </button>
          ))}
        </div>

        {/* 📅 날짜 표시 */}
        <h5 className="table-date mb-3">{date || '날짜 없음'}</h5>

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
              </tr>
            </thead>
            <tbody>
              {currentTasks.length > 0 ? (
                currentTasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.test}</td>
                    <td>{task.studentName}</td>
                    <td>{task.time}</td>

                    {/* ✅ arrivalTime만 수정 가능 */}
                    <td
                      onClick={() =>
                        setEditingCell({ id: task.id, field: 'arrivalTime' })
                      }
                    >
                      {editingCell.id === task.id &&
                      editingCell.field === 'arrivalTime' ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={task.arrivalTime || ''}
                          onChange={(e) =>
                            handleInlineChange(
                              task.id,
                              'arrivalTime',
                              e.target.value,
                              false
                            )
                          }
                          onBlur={(e) => {
                            handleInlineChange(
                              task.id,
                              'arrivalTime',
                              e.target.value,
                              true
                            ); // ✅ 저장
                            setEditingCell({ id: null, field: null });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleInlineChange(
                                task.id,
                                'arrivalTime',
                                e.target.value,
                                true
                              ); // ✅ 저장
                              setEditingCell({ id: null, field: null });
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        task.arrivalTime || '-'
                      )}
                    </td>

                    <td>{task.todo}</td>
                    <td>{task.homework}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📌 페이지네이션 버튼 */}
        {totalPages > 1 && (
          <div className="pagination mt-3 d-flex justify-content-center">
            <button
              className="btn btn-outline-dark btn-sm me-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              이전
            </button>
            <span>
              페이지 {currentPage} / {totalPages}
            </span>
            <button
              className="btn btn-outline-dark btn-sm ms-2"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TaskTable;
