import { useEffect, useRef } from 'react';
import ValidationHandler from './ValidationHandler';

function MapView() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById('map');

      // 로컬 스토리지에서 마지막 위치 불러오기
      const cachedMapData = loadMapCenterCache();
      const options = cachedMapData || {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),  // 기본 서울 좌표
        level: 3,
      };

      if (!mapRef.current) {
        // 지도 객체 생성
        mapRef.current = new window.kakao.maps.Map(container, options);

        // 중심 변경 이벤트 리스너 등록 (좌표 저장)
        kakao.maps.event.addListener(mapRef.current, 'center_changed', saveMapCenterCache);
      }

      // Ctrl+휠 확대 방지
      window.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      }, { passive: false });

      return () => {
        window.removeEventListener('wheel', (e) => {
          if (e.ctrlKey) e.preventDefault();
        });
      };
    }
  }, []);

  // 로컬 스토리지에서 중심 좌표 불러오기
  const loadMapCenterCache = () => {
    try {
      const cache = localStorage.getItem('mapCenter');
      if (cache) {
        const { lat, lng } = JSON.parse(cache);
        return {
          center: new window.kakao.maps.LatLng(lat, lng),
          level: 3,
        };
      }
    } catch (error) {
      console.error('지도 중심 좌표 캐시 로드 실패:', error);
    }
    return null;
  };

  // 중심 좌표를 로컬 스토리지에 저장하는 함수
  const saveMapCenterCache = () => {
    if (!mapRef.current) return;

    const center = mapRef.current.getCenter();
    const centerData = {
      lat: center.getLat(),
      lng: center.getLng(),
    };

    try {
      localStorage.setItem('mapCenter', JSON.stringify(centerData));
      console.log('지도 중심 좌표 저장 완료:', centerData);
    } catch (error) {
      console.error('지도 중심 좌표 저장 실패:', error);
    }
  };

  return (
    <div id="map" style={styles.map}>
      <ValidationHandler mapRef={mapRef} />
    </div>
  );
}

const styles = {
  map: {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 0,
  },
};

export default MapView;
