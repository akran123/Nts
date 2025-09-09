// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Print from './pages/Print';
import Task from './pages/Task';
import LoginModal from './components/LoginModal';
import SigninModal from './components/SigninModal';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignin, setShowSignin] = useState(false);

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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    closeLogin();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="app-container">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={openLogin}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/print" element={<Print />} />
          <Route path="/task" element={<Task />} />
        </Routes>
      </main>

      <Footer />

      {/* 로그인 모달 */}
      {showLogin && (
        <LoginModal
          onClose={closeLogin}
          onSwitch={openSignin}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* 회원가입 모달 */}
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
