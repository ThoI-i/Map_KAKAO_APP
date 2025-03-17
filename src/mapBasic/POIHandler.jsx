import { useEffect, useState } from "react";
import Modal from "./Modal";
import { fetchPOIData } from "./poiService"; // ✅ POI 가져오는 함수

const POIHandler = ({ mapRef }) => {
  const [selectedPOI, setSelectedPOI] = useState(null);

  // ✅ 클릭 시 POI 데이터 가져오기
  const handlePOIClick = async (mouseEvent) => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const center = { Lat: mouseEvent.latLng.getLat(), Lng: mouseEvent.latLng.getLng(), zoom: map.getLevel() };

    console.log(`📍 클릭 위치: (${center.Lat}, ${center.Lng}), 줌 레벨: ${center.zoom}`);

    // ✅ POI 데이터 가져오기 (가장 가까운 POI만 반환)
    const { nearestPOI } = await fetchPOIData(center, center.zoom);

    // ✅ 가장 가까운 POI가 있으면 상태 업데이트
    setSelectedPOI(nearestPOI);

    if (nearestPOI) {
      console.log("✅ 선택된 POI:", nearestPOI);
    } else {
      console.log("❌ 가까운 POI 없음");
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

export default POIHandler;
