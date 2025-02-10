import { useEffect } from 'react';

function App() {
  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init('e69b47d018fbeaf74a60b7a5d68e2606');  // 카카오 앱 키로 초기화
      console.log('Kakao SDK Initialized');
    }
  }, []);

  return <div>카카오 API 연동 예제</div>;
}

export default App;
