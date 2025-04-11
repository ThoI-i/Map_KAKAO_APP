import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './LoginForm.module.css';
import { login } from "../api/authService"; // ← authService에서 가져옴

const LoginForm = ({ onSuccess, visible }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!visible) return null; // ✨ 조건부 렌더링

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
  
    const success = await login(email, password);
    if (success) {
      onSuccess?.();
    } else {
      setError(`로그인 중 오류가 발생했어요 😢: ${err.message}`);
    }
  };
   
  
  // ✨ Portal로 렌더링할 JSX
  const formUI = (
    <div className={styles.loginOverlay}>
      <div className={styles.loginContent}>
        <h2>로그인</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin} className={styles.inputGroup}>
          <input
            type="text"
            placeholder="이메일 또는 닉네임"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  );

  return createPortal(formUI, document.body); // ✨ 핵심: Portal 렌더링
};

export default LoginForm;
