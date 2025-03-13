import { useEffect, useState } from "react";

const usePOILoader = (mapRef, setIsMapLoaded) => {
  useEffect(() => {
    if (!mapRef.current) {
      console.log("🔥 usePOILoader에서 mapRef.current가 없어서 초기화 시작!");

      const container = document.getElementById("map");
      if (!container) {
        console.error("❌ #map 컨테이너를 찾을 수 없습니다!");
        return;
      }

      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 3,
      };
      mapRef.current = new window.kakao.maps.Map(container, options);
      setIsMapLoaded(true); // ✅ 지도 로딩 완료 상태 변경
    }

    const map = mapRef.current;
    if (!map) return;

    // ✅ 줌 레벨 변경 이벤트 추가 (반경 설정 대신, 단순히 줌 변경 감지)
    kakao.maps.event.addListener(map, "zoom_changed", () => {
      console.log("현재 지도 레벨:", map.getLevel());
    });

    return () => {
      kakao.maps.event.removeListener(map, "zoom_changed");
    };
  }, [mapRef, setIsMapLoaded]);

  return;
};

export default usePOILoader;
