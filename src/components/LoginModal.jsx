// src/components/LoginModal.jsx

import { useState } from 'react';
import axios from '../axiosInstance.js';
import React from 'react';
import './LoginModal.css';

function LoginModal({ onClose,onSwitch, onLoginSuccess  }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/auth/login', {
        personalId: id,
        password: password,
      });

      const { token, userClassification} = response.data;
    

      // 토큰 저장 (로컬스토리지 또는 쿠키 등)
      localStorage.setItem('token', token);
      localStorage.setItem('userClassification', userClassification);


      // 성공 콜백 호출
      onLoginSuccess({ userClassification });

      // 모달 닫기 (필요 시)
      onClose();
    } catch (err) {
      console.error('로그인 실패:', err);
      setError('아이디 또는 비밀번호가 잘못되었습니다.');
    }
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
          <input type="text" placeholder="아이디" value={id} onChange={(e)=>setId(e.target.value)}/>
        </div>
        
        <div className="form-group1">
          <h5>Password</h5>
          <input type="password" placeholder="비밀번호" value={password} onChange={(e)=>setPassword(e.target.value)} onKeyDown={(e)=>{if(e.key ==='Enter') handleLogin();}}/>
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