import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setClickedLocation } from "../store/mapSlice";
import POIHandler from "../poi/POIHandler";
import { checkLoginStatus } from "../services/authService"; // ✅ 로그인 체크

const MapView = () => {
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const { lat, lng, zoom } = useSelector((state) => state.map);

  useEffect(() => {
    if (!mapRef.current) {
      const container = document.getElementById("map");
      if (!container) return;

      const options = { center: new window.kakao.maps.LatLng(lat, lng), level: zoom };
      mapRef.current = new window.kakao.maps.Map(container, options);

      // ✅ 지도 클릭 이벤트 추가
      window.kakao.maps.event.addListener(mapRef.current, "click", async (event) => {
        const { lat, lng } = event.latLng;

        // ✅ 로그인 체크 후 POI 요청 실행
        const isLoggedIn = await checkLoginStatus();
        if (!isLoggedIn) {
          alert("로그인이 필요합니다! 로그인 페이지로 이동합니다.");
          window.location.href = "/login";  
          return;
        }

        dispatch(setClickedLocation({ lat, lng }));
      });
    }
  }, [lat, lng, zoom, dispatch]);

  return (
    <div id="map" style={{ width: "100vw", height: "100vh" }}>
      <POIHandler mapRef={mapRef} dispatch={dispatch} />
    </div>
  );
};

export default MapView;
