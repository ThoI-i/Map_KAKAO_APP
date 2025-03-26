// src/auth/LoginForm.jsx

import React, { useState } from 'react';
import api from '../api/axios';

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/api/login', {
        emailOrNickname: email,  // ✅ 백엔드 DTO에 맞춰 key 수정!
        password: password
      });
      // ✅ accessToken 저장
      sessionStorage.setItem('accessToken', response.data.accessToken);

      // ✅ 로그인 후 성공 콜백 호출
      onSuccess();
    } catch (err) {
      if (err.response?.status === 404) {
        setError('존재하지 않는 회원입니다.');
      } else if (err.response?.status === 401) {
        setError('아이디, 비밀번호가 다릅니다.');
      } else {
        setError('로그인에 실패했습니다.');
      }
    }
  };

  return (
    <form   onSubmit={handleLogin}
    style={{
      position: "absolute",
      top: "100px",
      left: "100px",
      background: "#fff",
      border: "1px solid #ccc",
      padding: "1rem",
      zIndex: 9999,
    }}>
      
      <h3>로그인</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="email"
        placeholder="이메일/닉네임"
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
  );
};

export default LoginForm;
