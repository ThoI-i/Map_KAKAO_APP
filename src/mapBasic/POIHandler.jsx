import { useEffect, useState } from "react";
import Modal from "./Modal";
import { fetchPOIData } from "./poiService"; // ✅ POI 데이터 가져오는 함수
import CustomMarker from "./CustomMarker"; // ✅ 커스텀 마커 컴포넌트 추가

const POIHandler = ({ mapRef }) => {
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [center, setCenter] = useState(null); // ✅ 클릭한 위치 저장
  const geocoder = new kakao.maps.services.Geocoder(); // ✅ 주소 변환을 위한 Geocoder 객체

  // ✅ 클릭 시 POI 데이터 가져오기 & center 저장
  const handlePOIClick = async (mouseEvent) => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const lat = mouseEvent.latLng.getLat();
    const lng = mouseEvent.latLng.getLng();
    const newCenter = { Lat: lat, Lng: lng, zoom: map.getLevel() };

    console.log(`📍 클릭 위치: (${newCenter.Lat}, ${newCenter.Lng}), 줌 레벨: ${newCenter.zoom}`);

    // ✅ 클릭한 위치 저장 (커스텀 마커를 위해)
    setCenter(newCenter);

    // ✅ 도로명 주소 변환 요청
    geocoder.coord2Address(lng, lat, async (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        let address = result[0]?.road_address?.address_name || "주소 정보 없음";

        // ✅ POI 데이터 가져오기
        const { nearestPOI } = await fetchPOIData(newCenter, newCenter.zoom);

        if (nearestPOI) {
          console.log("✅ 선택된 POI:", nearestPOI);
          setSelectedPOI(nearestPOI);
        } else {
          console.log("❌ 가까운 POI 없음, 커스텀 좌표 표시");
          setSelectedPOI({
            place_name: "커스텀 좌표",
            address_name: address,
            category_group_name: "", // POI 없을 때 공백
            distance: "", // 거리 정보 없음
          });
        }
      }
    });
  };

  // ✅ 지도 클릭 이벤트 등록
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
      {/* ✅ 클릭한 위치(center)를 CustomMarker로 전달 */}
      {center && <CustomMarker mapRef={mapRef} center={center} />}
      
      {/* ✅ POI 정보가 있을 때 모달 표시 */}
      {selectedPOI && (
        <Modal
          place={selectedPOI}
          onClose={() => {
            setSelectedPOI(null);
            setCenter(null); // ✅ 모달 닫힐 때 마커 삭제
          }}
        />
      )}
    </>
  );
};

export default POIHandler;