function LoginButton() {
  const handleLogin = () => {
    window.Kakao.Auth.login({
      success: (authObj) => {
        console.log('로그인 성공:', authObj);
      },
      fail: (err) => {
        console.error('로그인 실패:', err);
      },
    });
  };

  return <button onClick={handleLogin}>카카오 로그인</button>;
}

export default LoginButton;
