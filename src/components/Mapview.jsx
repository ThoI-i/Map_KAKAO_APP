import { useEffect, useRef } from 'react';

function MapView() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById('map');

      // 캐시 데이터 확인 및 초기 설정
      const cachedMapData = loadMapCache();
      const options = cachedMapData || {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),  // 기본 서울 좌표
        level: 3,
      };

      // 지도 생성
      if (!mapRef.current) {
        mapRef.current = new window.kakao.maps.Map(container, options);
        console.log('지도 객체 생성 완료:', mapRef.current);

        // 타일 로드 완료 시 캐시 업데이트
        kakao.maps.event.addListener(mapRef.current, 'tilesloaded', saveMapCache);

        // 확대/축소 이벤트 처리
        kakao.maps.event.addListener(mapRef.current, 'zoom_changed', handleZoomChange);
      }

      // 페이지 확대 방지 이벤트 추가
      window.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
          e.preventDefault();  // Ctrl + 휠로 페이지 확대 방지
        }
      }, { passive: false });

      return () => {
        window.removeEventListener('wheel', (e) => {
          if (e.ctrlKey) e.preventDefault();
        });
      };
    } else {
      console.error('카카오 지도 API가 로드되지 않았습니다.');
    }
  }, []);

  // 확대/축소 이벤트 핸들러
  const handleZoomChange = () => {
    if (!mapRef.current) return;

    console.log('확대/축소 이벤트 발생');
    mapRef.current.relayout();  // 화면 즉시 갱신
  };

  // 캐시에서 지도 설정을 로드하는 함수
  const loadMapCache = () => {
    try {
      const cache = localStorage.getItem('mapCache');
      if (cache) {
        const { center, level } = JSON.parse(cache);
        return {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level,
        };
      }
    } catch (error) {
      console.error('지도 캐시 로드 실패:', error);
    }
    return null;
  };

  // 지도 설정을 캐시에 저장하는 함수
  const saveMapCache = () => {
    if (!mapRef.current) return;

    const center = mapRef.current.getCenter();
    const level = mapRef.current.getLevel();

    const cacheData = {
      center: { lat: center.getLat(), lng: center.getLng() },
      level,
    };

    try {
      localStorage.setItem('mapCache', JSON.stringify(cacheData));
      console.log('지도 캐시 저장 완료');
    } catch (error) {
      console.error('지도 캐시 저장 실패:', error);
    }
  };

  return <div id="map" style={styles.map}></div>;
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
