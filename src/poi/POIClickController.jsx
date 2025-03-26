import React, { useState } from 'react';
import POIChecker from '../auth/POIChecker';
import POIHandler from './POIHandler';
import LoginForm from '../auth/LoginForm';


// 로그인 판단(POICheck)에 따른 후속 진행
// → 로그인 O → POIHandler 실행
// → 로그인 X → LoginForm 렌더링
const POIClickController = ({ mapRef }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      {/* 아직 로그인 상태 판단 전이면 POIChecker 실행 */}
      {isLoggedIn === null && (
        <POIChecker onResult={(status) => setIsLoggedIn(status)} />
      )}

      {/* 로그인 상태에 따라 분기 */}
      {isLoggedIn === true && <POIHandler mapRef={mapRef} />}
      {isLoggedIn === false && (
        <LoginForm onSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default POIClickController;
