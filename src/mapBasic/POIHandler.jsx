import { useEffect, useState } from "react";
import Modal from "./Modal";
import { fetchPOIData } from "./poiService"; // ✅ POI 검색 함수

const POIHandler = ({ mapRef }) => {
  const [selectedPOI, setSelectedPOI] = useState(null);

  // ✅ 클릭한 위치에서 가장 가까운 POI 찾기
  const handlePOIClick = async (mouseEvent) => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const lat = mouseEvent.latLng.getLat();
    const lng = mouseEvent.latLng.getLng();
    const center = new kakao.maps.LatLng(lat, lng);
    const zoomLevel = map.getLevel(); // ✅ 현재 지도 레벨 가져오기
    
    console.log(`📍 클릭 위치: (${lat}, ${lng}), 현재 줌 레벨: ${zoomLevel}`);

    // ✅ 클릭한 위치 반경 내 POI 데이터 가져오기
    const pois = await fetchPOIData(center, zoomLevel);
    
    // ✅ 현재 지도 레벨에서 POI 아이콘이 있는 데이터만 필터링
    const validPOIs = pois.filter(poi => poi.hasIcon);
    
    if (validPOIs.length > 0) {
      // ✅ 가장 가까운 POI 찾기
      const nearestPOI = validPOIs.reduce((closest, poi) => {
        const poiDistance = getDistance(center, new kakao.maps.LatLng(poi.y, poi.x));
        return poiDistance < closest.distance ? { ...poi, distance: poiDistance } : closest;
      }, { ...validPOIs[0], distance: getDistance(center, new kakao.maps.LatLng(validPOIs[0].y, validPOIs[0].x)) });

      setSelectedPOI(nearestPOI); // ✅ 가장 가까운 POI 정보 표시
      console.log("✅ 선택된 POI:", nearestPOI);
    } else {
      setSelectedPOI(null);
      console.log("❌ 현재 줌 레벨에서 POI 아이콘 없음");
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    kakao.maps.event.addListener(map, "click", handlePOIClick);

    return () => {
      kakao.maps.event.removeListener(map, "click", handlePOIClick);
    };
  }, [mapRef]);

  return (
    <>
      {selectedPOI && <Modal place={selectedPOI} onClose={() => setSelectedPOI(null)} />}
    </>
  );
};

/**
 * ✅ 두 좌표 간 거리 계산 (단위: m)
 */
const getDistance = (pos1, pos2) => {
  const R = 6371e3; // 지구 반지름 (m)
  const lat1 = pos1.getLat() * (Math.PI / 180);
  const lat2 = pos2.getLat() * (Math.PI / 180);
  const deltaLat = (pos2.getLat() - pos1.getLat()) * (Math.PI / 180);
  const deltaLng = (pos2.getLng() - pos1.getLng()) * (Math.PI / 180);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c); // 거리 반환 (m, 소수점 제거)
};

export default POIHandler;
