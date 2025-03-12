import { useEffect, useState } from "react";
import Modal from "./Modal";

function POIHandler({ mapRef, pois }) {
  const [selectedPOI, setSelectedPOI] = useState(null);

  useEffect(() => {
    if (!mapRef?.current) return; // ?.(optional chaining) 연산자
                                  // mapRef 자체가 undefined / null 경우 방지

    const map = mapRef.current; // POILoader.jsx에서 받아온 mapRef 사용
    
    kakao.maps.event.removeListener(map, "click"); // 기존 이벤트 리스너 제거 (중복 생성 방지)
   
    // ? 클릭 이벤트 리스너 추가
    const handleClick = (mouseEvent) => {
      const lat = mouseEvent.latLng.getLat();
      const lng = mouseEvent.latLng.getLng();

      // ? 현재 보이는 POI 목록에서 클릭한 좌표와 가장 가까운 POI 찾기
      const closestPOI = pois.reduce((closest, poi) => {
        const poiLat = parseFloat(poi.y);
        const poiLng = parseFloat(poi.x);
        const distance = Math.sqrt((lat - poiLat) ** 2 + (lng - poiLng) ** 2);

        return !closest || distance < closest.distance
          ? { ...poi, distance }
          : closest;
      }, null);

      if (closestPOI && closestPOI.distance < 0.002) { // ? 클릭한 위치 근처에 POI가 있는 경우만 표시
        setSelectedPOI({
          name: closestPOI.place_name,
          address: closestPOI.address_name,
        });
      } else {
        setSelectedPOI(null);
      }
    };

    kakao.maps.event.addListener(map, "click", handleClick); // 클릭 이벤트 발생마다 handleClick()함수 실행

    // 컴포넌트 언마운트 시 리스너 제거 Cleanup(정리) 함수
    // ㄴPOIHandler 컴포넌트 종료 시 → 자동 실행(Unmount)
    return () => {
      kakao.maps.event.removeListener(map, "click", handleClick);
    };
  }, [mapRef, pois]); // ? mapRef를 의존성으로 포함 → POILoader.jsx에서 변경된 map을 반영 가능

  return (
    <>
      {selectedPOI && <Modal place={selectedPOI} onClose={() => setSelectedPOI(null)} />}
    </>
  );
}

export default POIHandler;
