import { useEffect, useState } from "react";
import Modal from "./Modal";

function POIHandler({ mapRef, pois }) {
  const [selectedPOI, setSelectedPOI] = useState(null);

  useEffect(() => {
    if (!mapRef.current) return;

    kakao.maps.event.addListener(mapRef.current, "click", (mouseEvent) => {
      const lat = mouseEvent.latLng.getLat();
      const lng = mouseEvent.latLng.getLng();

      // ✅ 클릭한 위치에서 가장 가까운 POI 찾기
      const closestPOI = pois.reduce((closest, poi) => {
        const poiLat = parseFloat(poi.y);
        const poiLng = parseFloat(poi.x);
        const distance = Math.sqrt((lat - poiLat) ** 2 + (lng - poiLng) ** 2);

        return !closest || distance < closest.distance
          ? { ...poi, distance }
          : closest;
      }, null);

      if (closestPOI && closestPOI.distance < 0.002) { // ✅ 클릭 범위 내 POI만 선택
        setSelectedPOI({
          name: closestPOI.place_name,
          address: closestPOI.address_name,
        });
      } else {
        setSelectedPOI(null);
      }
    });
  }, [mapRef, pois]);

  return (
    <>
      {selectedPOI && <Modal place={selectedPOI} onClose={() => setSelectedPOI(null)} />}
    </>
  );
}

export default POIHandler;
