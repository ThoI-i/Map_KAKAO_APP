import { useEffect, useRef, useState } from 'react';
import ValidationHandler from './ValidationHandler';
import { getCustomMarker } from './MarkerColor';

function MapView() {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]); // ✅ 저장된 마커 리스트

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 3,
      };

      if (!mapRef.current) {
        mapRef.current = new window.kakao.maps.Map(container, options);
      }

      updateMarkers();
    }
  }, []);

  const updateMarkers = () => {
    if (!mapRef.current) return;

    const storedKeys = Object.keys(localStorage).filter(key => key.startsWith('marker'));
    const storedMarkers = storedKeys.map(key => JSON.parse(localStorage.getItem(key)));

    // ✅ 기존 마커 삭제
    markers.forEach(marker => marker.setMap(null));

    // ✅ 저장된 마커 표시
    const newMarkers = storedMarkers.map(({ lat, lng, color }) => {
      return new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        map: mapRef.current,
        image: getCustomMarker(color),
      });
    });

    setMarkers(newMarkers);
  };

  return (
    <div id="map" style={styles.map}>
      <ValidationHandler mapRef={mapRef} updateMarkers={updateMarkers} />
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
