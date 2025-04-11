import React, { useState, useEffect } from 'react';
import { useLoginChecker } from '../../auth/hooks/useLoginChecker'; // ✅ 훅으로 import!
import POIHandler from './POIHandler';
import LoginForm from '../../auth/components/LoginForm';

const POIClickController = ({ mapRef }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // ✅ POIChecker 훅 사용 (렌더링 X)
  useLoginChecker(setIsLoggedIn);

  // ✅ 디버깅 로그
  useEffect(() => {
    console.log('📌 [POIClickController] isLoggedIn 상태:', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <>
      {isLoggedIn === true && <POIHandler mapRef={mapRef} />}
      {isLoggedIn === false && (
        <LoginForm onSuccess={handleLoginSuccess} visible />
      )}
    </>
  );
};

export default POIClickController;
