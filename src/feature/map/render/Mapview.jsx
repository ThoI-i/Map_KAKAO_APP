import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import POIClickController from '../../poi/containers/POIClickController';

const MapView = () => {
  const mapRef = useRef(null);
  const { lat, lng, zoom } = useSelector((state) => state.map);
  const [clickKey, setClickKey] = useState(0); // ✅ 상태 추가

  useEffect(() => {
    if (!mapRef.current) {
      const container = document.getElementById('map');
      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: zoom,
      };
      mapRef.current = new window.kakao.maps.Map(container, options);

      // ✅ 지도 클릭 이벤트 등록
      window.kakao.maps.event.addListener(mapRef.current, 'click', () => {
        setClickKey((prev) => prev + 1); // ← key 변경으로 리렌더링 유도
      });
    }
  }, [lat, lng, zoom]);

  return (
    <>
      <div id="map" style={{ width: '100vw', height: '100vh', position: 'relative' }} />
      <POIClickController key={clickKey} mapRef={mapRef} /> {/* ✅ key로 마운트 트리거 */}
    </>
  );
};

export default MapView;
