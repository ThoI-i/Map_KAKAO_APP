import { useEffect } from 'react';
import LoginButton from './components/LoginButton';
import SearchPlaces from './components/SearchPlaces';
import Favorites from './components/Favorites';
import MapView from './components/Mapview'

function App() {
  // 1단계: 카카오 SDK 초기화
  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init('e69b47d018fbeaf74a60b7a5d68e2606');  // 카카오 앱 키로 초기화
      console.log('Kakao SDK Initialized');
    }
  }, []);

  // 2단계: 로그인 버튼 렌더링
  return (
    <div>
      <h1>카카오 API 예제</h1>
      <LoginButton />
      <SearchPlaces />  {/* 장소 검색 기능 */}
      <Favorites />  {/* 즐겨찾기 기능 추가 */}
      <MapView />  {/* 지도 기능 추가 */}
    </div>
  );
}

export default App;
