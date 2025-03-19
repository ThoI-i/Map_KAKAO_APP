import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setClickedLocation } from "../store/mapSlice";
import POIHandler from "./POIHandler";

const MapView = () => {
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const { lat, lng, zoom } = useSelector((state) => state.map);

  useEffect(() => {
    if (!mapRef.current) {
      console.log("🔥 지도 초기화!");

      const container = document.getElementById("map");
      if (!container) {
        console.error("❌ #map 컨테이너를 찾을 수 없습니다!");
        return;
      }

      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: zoom,
      };

      mapRef.current = new window.kakao.maps.Map(container, options);
    }
  }, [lat, lng, zoom]);

  return (
    <div id="map" style={{ width: "100vw", height: "100vh" }}>
      <POIHandler mapRef={mapRef} dispatch={dispatch} />
    </div>
  );
};

export default MapView;
