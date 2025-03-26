import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import POIClickController from "../poi/POIClickController";

const MapView = () => {
  const mapRef = useRef(null);
  const { lat, lng, zoom } = useSelector((state) => state.map);

  useEffect(() => {
    if (!mapRef.current) {
      const container = document.getElementById("map");
      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: zoom,
      };
      mapRef.current = new window.kakao.maps.Map(container, options);
    }
  }, [lat, lng, zoom]);

  return (
    <>
      <div id="map" style={{ width: "100vw", height: "100vh" }} />
      <POIClickController mapRef={mapRef} /> {/* ✅ 클릭 분기 전용 컴포넌트 */}
    </>
  );
};

export default MapView;
