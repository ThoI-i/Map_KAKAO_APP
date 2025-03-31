import { useEffect } from 'react';
import {
  tryAutoLogin,     // 자동 로그인
} from '../api/authService';

/**
 * 로그인 상태 확인 커스텀 훅
 * 
 * Access Token 존재 ✅ → 이후 동작 실행
 * Access Token 없음 ❌ → 
 *   ├── Refresh Token 존재 ✅ → Access Token 재발급 → 이후 동작 실행
 *   └── Refresh Token 없음 ❌ → 로그인 폼 렌더링
 */

export const useLoginChecker = (onResult) => {
  useEffect(() => {
    const verifyLogin = async () => {
      const isLoggedIn = await tryAutoLogin(); // 👈 서비스 통합 로직 호출
      onResult(isLoggedIn); // true → 유지 / false → 로그인 UI
    };

    verifyLogin();
  }, [onResult]);
};