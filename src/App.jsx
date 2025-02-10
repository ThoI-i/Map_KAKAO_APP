import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import LoginButton from './components/LoginButton';
import SearchPlaces from './components/SearchPlaces';
import Favorites from './components/Favorites';
import MapView from './components/Mapview';


function App() {
  const [activeTab, setActiveTab] = useState('map');  // 기본 페이지를 'map'으로 설정

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('e69b47d018fbeaf74a60b7a5d68e2606');
      console.log('Kakao SDK Initialized');
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return <MapView />;
      case 'search':
        return <SearchPlaces />;
      case 'favorites':
        return <Favorites />;
      case 'login':
        return <LoginButton />;
      default:
        return <MapView />;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onTabChange={setActiveTab} />
      <div style={{ marginLeft: '200px', padding: '20px', width: '100%' }}>
        <h1>카카오 API 예제</h1>
        {renderContent()}  {/* 탭에 따라 컴포넌트 변경 */}
      </div>
    </div>
  );
}

export default App;
