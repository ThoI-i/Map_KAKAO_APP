import { useEffect } from 'react';
import { checkLoginStatus } from '../api/authService';

export const usePOIChecker = (onResult) => {
  useEffect(() => {
    const status = checkLoginStatus(); // accessToken 확인
    onResult(status); // 결과 전달
  }, [onResult]);
};
