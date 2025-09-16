import React, { useState } from 'react';
import PrintManager from './PrintManage.jsx'; // 문제 관리
 import UserManager from './UserManage.jsx';

const pages = ['학생', '문제', '사용자'];

const AdminTable = () => {
  const [selectedPage, setSelectedPage] = useState('문제'); // 기본값 학생

  const renderPage = () => {
    switch (selectedPage) {
      case '학생':
        return <StudentManager />;
      case '문제':
        return <PrintManager />;
      case '사용자':
        return <UserManager />;
    }
  };

  return (
    <section className="table-section">
      <div className="container">
        {/* 상단 탭 버튼 */}
        <div className="page-buttons mb-3">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setSelectedPage(page)}
              className={`btn btn-sm me-2 ${
                selectedPage === page ? 'btn-dark' : 'btn-outline-dark'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* 선택된 페이지에 맞는 관리자 테이블 */}
        <div className="table-wrapper table-responsive p-3 shadow-sm bg-white rounded">
          {renderPage()}
        </div>
      </div>
    </section>
  );
};

export default AdminTable;