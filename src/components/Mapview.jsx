import { useEffect, useRef } from 'react';
import ValidationHandler from './ValidationHandler';

function MapView() {
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById('map');

      const cachedMapData = loadMapCenterCache();
      const options = cachedMapData || {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 3,
      };

      if (!mapRef.current) {
        mapRef.current = new window.kakao.maps.Map(container, options);

        // DrawingManager 초기화
        drawingManagerRef.current = new kakao.maps.drawing.DrawingManager({
          map: mapRef.current,
          drawingMode: ['marker'],
          markerOptions: {
            draggable: true,
            removable: true,
          },
        });

        kakao.maps.event.addListener(mapRef.current, 'center_changed', saveMapCenterCache);
      }

      window.addEventListener('wheel', (e) => {
        if (e.ctrlKey) e.preventDefault();
      }, { passive: false });

      return () => {
        window.removeEventListener('wheel', (e) => {
          if (e.ctrlKey) e.preventDefault();
        });
      };
    }
  }, []);

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

  const saveMapCenterCache = () => {
    if (!mapRef.current) return;

    const center = mapRef.current.getCenter();
    localStorage.setItem('mapCenter', JSON.stringify({ lat: center.getLat(), lng: center.getLng() }));
  };

  return (
    <div id="map" style={styles.map}>
      <ValidationHandler mapRef={mapRef} drawingManagerRef={drawingManagerRef} />
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
