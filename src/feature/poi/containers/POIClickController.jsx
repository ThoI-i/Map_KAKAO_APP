import React, { useState, useEffect } from 'react';
import POIChecker from '../../auth/hooks/POIChecker';
import POIHandler from './POIHandler';
import LoginForm from '../../auth/components/LoginForm';

// 로그인 판단(POICheck)에 따른 후속 진행
// → 로그인 O → POIHandler 실행
// → 로그인 X → LoginForm 렌더링
const POIClickController = ({ mapRef }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // ✅ 디버깅용 로그
  useEffect(() => {
    console.log('📌 [POIClickController] isLoggedIn 상태:', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <>
      {/* 아직 로그인 상태 판단 전이면 POIChecker 실행 */}
      {isLoggedIn === null && (
        <POIChecker onResult={(status) => setIsLoggedIn(status)} />
      )}

      {/* 로그인 상태에 따라 분기 */}
      {isLoggedIn === true && <POIHandler mapRef={mapRef} />}
      {isLoggedIn === false && (
        <LoginForm onSuccess={handleLoginSuccess} visible />
      )}
    </>
  );
};

export default POIClickController;
