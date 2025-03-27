import { useEffect } from 'react';
import { checkLoginStatus } from '../api/authService';

// 로그인(Access Token 존재 유/무 판단)
const POIChecker = ({ onResult }) => {
  useEffect(() => {
    const status = checkLoginStatus(); // accessToken 유무 판단
    onResult(status); // 부모 컴포넌트로 전달
  }, [onResult]);

  return null; // 렌더링 안 함
};

export default POIChecker;
