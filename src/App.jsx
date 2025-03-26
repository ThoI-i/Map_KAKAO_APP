import { useEffect, useState } from 'react';
import MapView from "./map/Mapview";
function App() {
  const [activeTab, setActiveTab] = useState('map');  // 기본 페이지를 'map'으로 설정

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('2fab7c6ab498c232293fca173c844800');
      console.log('Kakao SDK Initialized');
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return <MapView />;  // 지도를 표시하는 컴포넌트
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
      {/* <Sidebar onTabChange={setActiveTab} /> */}
      <div style={{ width: '100%' }}>
        {renderContent()}  {/* 탭에 따라 컴포넌트 변경 */}
      </div>
    </div>
  );
}

export default App;
