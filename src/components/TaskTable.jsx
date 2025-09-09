import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TaskTable.css';

const TaskTable = () => {
  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0];
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(formattedDate);
  const [selectedTeacher, setSelectedTeacher] = useState('봉유리');
  const [currentPage, setCurrentPage] = useState(1); // ✅ 현재 페이지
  const tasksPerPage = 8; // ✅ 한 페이지에 보여줄 개수

  const teachers = ['봉유리', '이제영', '강승화', '김남해','변경진'];

  const fetchTasks = (teacherName) => {
    axios.get('http://localhost:8080/task/get_tasks', {
      params: { name: teacherName ,date:formattedDate}
    })
      .then(res => {
        setTasks(res.data);
        setSelectedTeacher(teacherName);
        if (res.data.length > 0) {
          setDate(formattedDate);
        } else {
          setDate('');
        }
        setCurrentPage(1); // ✅ 새로 불러올 때 첫 페이지로 초기화
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
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
        {/* 🔘 선생님 선택 버튼 */}
        <div className="teacher-buttons mb-3">
          {teachers.map((teacher) => (
            <button
              key={teacher}
              className={`btn btn-sm me-2 ${selectedTeacher === teacher ? 'btn-dark' : 'btn-outline-dark'}`}
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
                <th>학생 이름</th>
                <th>시간</th>
                <th>도착시간</th>
                <th>할일</th>
                <th>숙제</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.length > 0 ? (
                currentTasks.map((task, idx) => (
                  <tr key={task.id || idx}>
                    <td>{task.studentName}</td>
                    <td>{task.time}</td>
                    <td>{task.arrivalTime || '-'}</td>
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
      </div>
    </section>
  );
};

export default TaskTable;
