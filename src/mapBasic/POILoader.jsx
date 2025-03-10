import { useEffect } from "react";

function POILoader({ mapRef, setPois }) {
  useEffect(() => {
    if (!mapRef.current) return;

    const places = new kakao.maps.services.Places();

    const loadPOIs = () => {
      const center = mapRef.current.getCenter(); // ✅ 지도 중심 좌표
      const zoomLevel = mapRef.current.getLevel(); // ✅ 현재 줌 레벨
      const categoryCode = "CE7"; // ✅ 카페 정보 불러오기

      places.categorySearch(categoryCode, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          console.log("불러온 POI 데이터:", result);
          setPois(result);
        }
      }, {
        location: center,
        radius: zoomLevel * 200, // ✅ 줌 레벨에 따라 반경 조정
      });
    };

    kakao.maps.event.addListener(mapRef.current, "zoom_changed", loadPOIs);
    loadPOIs(); // ✅ 초기 로드

  }, [mapRef, setPois]);

  return null;
}

export default POILoader;
