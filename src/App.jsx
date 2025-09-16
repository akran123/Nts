import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance.js'; // 만든 axios 인스턴스

// 컴포넌트
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Print from './pages/Print';
import Task from './pages/Task';
import Admin from './pages/Admin';
import TaskManagePage from './pages/TaskManagePage';
import LoginModal from './components/LoginModal';
import SigninModal from './components/SigninModal';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });


  const [showLogin, setShowLogin] = useState(false);  
  const [showSignin, setShowSignin] = useState(false);
  const [userClassification, setUserClassification] = useState(() => localStorage.getItem('userClassification') || null);

  const navigate = useNavigate();

  // Axios 인터셉터 설정 (alert 기반)
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      response => response,
      error => {
        const { response } = error;
        if (!response) return Promise.reject(error); // 네트워크 에러 등

        const { status, data } = response;

        if (status === 401) {
          setIsLoggedIn(false);
          localStorage.clear();
          setShowLogin(true); // 로그인 모달 열기
        } else if (status === 403) {
          navigate('/home'); // 홈으로 리다이렉트
        }
  

        return Promise.reject(error); // 에러를 계속 전달
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor); // 컴포넌트 언마운트 시 제거
    };
  }, [navigate]);
  
  useEffect(() => {
    const savedRole = localStorage.getItem("userClassification");
    if (savedRole) {
      setUserClassification(savedRole);
    }
  }, [isLoggedIn]);

  // 로그인/로그아웃/모달 관련 핸들러
  const openLogin = () => {
    setShowLogin(true);
    setShowSignin(false);
  };

  const closeLogin = () => setShowLogin(false);
  const openSignin = () => {
    setShowSignin(true);
    setShowLogin(false);
  };
  const closeSignin = () => setShowSignin(false);

  const handleLoginSuccess = ({userClassification}) => {
    setIsLoggedIn(true);
    setUserClassification(userClassification)
    closeLogin();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    setUserClassification(null);
    window.location.href = '/';
  };

  return (
    <div className="app-container">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={openLogin}
        onLogout={handleLogout}
        userClassification={userClassification}
      />

      <main className="main-content">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/print" element={<Print />} />
          <Route path="/task" element={<Task />} />
          <Route path="/taskmanage" element={<TaskManagePage />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <Footer />

      {showLogin && (
        <LoginModal
          onClose={closeLogin}
          onSwitch={openSignin}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showSignin && (
        <SigninModal
          onClose={closeSignin}
          onSwitch={openLogin}
        />
      )}
    </div>
  );
}

export default App;
