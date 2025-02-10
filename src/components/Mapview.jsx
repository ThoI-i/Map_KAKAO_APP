import { useEffect } from 'react';

function MapView() {
  useEffect(() => {
    // kakao.maps가 정의되지 않았으면 로직을 실행하지 않음
    if (!window.kakao || !window.kakao.maps) {
      console.error('카카오 지도 API가 로드되지 않았습니다.');
      return;
    }

    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),  // 서울 좌표
      level: 3,
    };
    new window.kakao.maps.Map(container, options);
  }, []);

  return <div id="map" style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>;
}

export default MapView;
