// src/components/SigninModal.jsx

import React from 'react';
import './SigninModal.css';

function SigninModal({ onClose, onSwitch }) {
  return (
    <div className="modal-backdrop">
      <div className="signin-modal">
        <div className="close-button">
          <button onClick={onClose}>x</button>
        </div>
        <h2 className="signin-info">Sign Up</h2>

        <div className="form-group2">
          <h4>Id</h4>
          <input type="text" placeholder="아이디" />
        </div>

        <div className="form-group2">
          <h4>Password</h4>
          <input type="password" placeholder="비밀번호" />
        </div>

        <div className="form-group2">
          <h4>Confirm Password</h4>
          <input type="password" placeholder="비밀번호 확인" />
        </div>

        <div className="buttons">
          <button>회원가입</button>
        </div>
      </div>
    </div>
  );
}

export default SigninModal;
