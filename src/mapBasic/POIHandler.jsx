import { useEffect, useState } from "react";
import Modal from "./Modal";
import { fetchPOIData } from "./poiService"; // ✅ POI 검색 함수 가져오기

const POIHandler = ({ mapRef, pois, setPois }) => {
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null); // ✅ 클릭한 좌표 저장

  useEffect(() => {
    if (!mapRef.current) {
      console.warn("⚠️ POIHandler에서 mapRef.current가 초기화되지 않았습니다.");
      return;
    }

    console.log("✅ POIHandler에서 mapRef.current:", mapRef.current);

    const map = mapRef.current;

    // ✅ 클릭할 때마다 최신 POI 검색
    const handleClick = async (mouseEvent) => {
      const lat = mouseEvent.latLng.getLat();
      const lng = mouseEvent.latLng.getLng();
      setClickedLocation({ lat, lng }); // ✅ 클릭한 위치 저장

      const newPOIs = await fetchPOIData(lat, lng, map.getLevel()); // ✅ POI 검색
      setPois(newPOIs); // ✅ 최신 POI 데이터 갱신
    };

    kakao.maps.event.addListener(map, "click", handleClick);

    return () => {
      kakao.maps.event.removeListener(map, "click", handleClick);
    };
  }, [mapRef, setPois]);

  // ✅ pois가 업데이트될 때마다 가장 가까운 POI 자동 선택
  useEffect(() => {
    if (!clickedLocation || pois.length === 0) return;

    const { lat, lng } = clickedLocation;
    const closestPOI = pois.reduce((prev, curr) => {
      const prevDist = Math.sqrt((lat - parseFloat(prev.y)) ** 2 + (lng - parseFloat(prev.x)) ** 2);
      const currDist = Math.sqrt((lat - parseFloat(curr.y)) ** 2 + (lng - parseFloat(curr.x)) ** 2);
      return currDist < prevDist ? curr : prev;
    });

    if (closestPOI) {
      setSelectedPOI({
        name: closestPOI.place_name,
        address: closestPOI.address_name,
        category: closestPOI.category_group_name,
      });
    } else {
      setSelectedPOI(null);
    }
  }, [pois]);

  return (
    <>
      {selectedPOI && <Modal place={selectedPOI} onClose={() => setSelectedPOI(null)} />}
    </>
  );
};

export default POIHandler;
