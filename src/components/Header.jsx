// src/components/Header.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ isLoggedIn, onLoginClick, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
      <div className="container">
        {/* 로고 */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <span className="ms-2 fw-bold text-dark">ChargeM5</span>
        </Link>

        {/* 햄버거 버튼 */}
        <button className="navbar-toggler" type="button" onClick={toggleMenu}>
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 메뉴 항목 */}
        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link text-dark">홈</Link>
            </li>
            <li className="nav-item">
              <Link to="/print" className="nav-link text-dark">프린트</Link>
            </li>
            <li className="nav-item">
                  <Link to="/task" className="nav-link text-dark">과제</Link>
                </li>
            {/* ✅ 로그인한 경우만 표시될 메뉴 */}
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link to="/taskmanage" className="nav-link text-dark">과제관리</Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link text-dark">학생관리</Link>
                </li>
              </>
            )}  
          </ul>


          {/* 로그인 버튼 */}
          <div className="d-flex ms-lg-3">
            {isLoggedIn ? (
              <button className="btn btn-outline-dark" onClick={onLogout}>로그아웃</button>
            ) : (
              <Link to="/login" className="btn btn-dark" onClick={onLoginClick}>로그인</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
