import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import POIClickController from '../../poi/containers/POIClickController';

const MapView = () => {
  const mapRef = useRef(null);
  const { lat, lng, zoom } = useSelector((state) => state.map);
  const [clickKey, setClickKey] = useState(null); // 🔥 초기값 null

  useEffect(() => {
    if (!mapRef.current) {
      const container = document.getElementById('map');
      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: zoom,
      };
      mapRef.current = new window.kakao.maps.Map(container, options);

      // ✅ 클릭 시에만 clickKey 변경
      window.kakao.maps.event.addListener(mapRef.current, 'click', () => {
        setClickKey(prev => (prev === null ? 0 : prev + 1));
      });
    }
  }, [lat, lng, zoom]);

  return (
    <>
      <div id="map" style={{ width: '100vw', height: '100vh', position: 'relative' }} />
      {/* 👇 클릭 전에는 렌더링하지 않음 */}
      {clickKey !== null && (
        <POIClickController key={clickKey} mapRef={mapRef} />
      )}
    </>
  );
};

export default MapView;
