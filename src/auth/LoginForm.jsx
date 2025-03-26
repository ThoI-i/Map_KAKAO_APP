import React, { useState } from 'react';

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:9000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ 쿠키 포함
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

      // ✅ accessToken 저장
      sessionStorage.setItem('accessToken', data.accessToken);

      // ✅ 로그인 성공 콜백 호출
      onSuccess();

    } catch (err) {
      setError(`로그인 중 오류가 발생했어요 😢: ${err.message}`);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      style={{
        position: "absolute",
        top: "100px",
        left: "100px",
        background: "#fff",
        border: "1px solid #ccc",
        padding: "1rem",
        zIndex: 9999,
      }}
    >
      <h3>로그인</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"  // ✅ 이메일 or 닉네임
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
