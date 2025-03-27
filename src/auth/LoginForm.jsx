import React, { useState } from 'react';
import styles from './LoginForm.module.css';


const LoginForm = ({ onSuccess, visible }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!visible) return null; // ✨ 조건부 렌더링

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:9000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          emailOrNickname: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        if (response.status === 404) {
          setError('존재하지 않는 회원입니다.');
        } else if (response.status === 401) {
          setError('아이디, 비밀번호가 다릅니다.');
        } else {
          setError(`로그인에 실패했습니다: ${errorMessage}`);
        }
        return;
      }

      const data = await response.json();
      sessionStorage.setItem('accessToken', data.accessToken);
      onSuccess();
    } catch (err) {
      setError(`로그인 중 오류가 발생했어요 😢: ${err.message}`);
    }
  };

  return (
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
};


export default LoginForm;
