// src/components/LoginModal.jsx

import React from 'react';
import './LoginModal.css';

function LoginModal({ onClose,onSwitch, onLoginSuccess  }) {
  const handleLogin = () => {
    // ✅ 실제 로그인 로직이 있다면 여기에 추가
    // 예: axios 요청 → 성공 시 onLoginSuccess()
    onLoginSuccess();
  };
  return (
    <div className="modal-backdrop1">
      <div className="login-modal">
        <div className="close-button">
          <button onClick={onClose}>x</button>
        </div>
        <h2 className='login-info'>Login</h2>

        <div className="form-group1">
          <h5>Id</h5>
          <input type="text" placeholder="아이디" />
        </div>
        
        <div className="form-group1">
          <h5>Password</h5>
          <input type="password" placeholder="비밀번호" />
        </div>

        <div className="buttons1">
          <button onClick={handleLogin}>로그인</button>
        </div>
        <div className="switch-link">
            <span>계정이 없으신가요?</span>
            <button onClick={onSwitch}>회원가입</button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;