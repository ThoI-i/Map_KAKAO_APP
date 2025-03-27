import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClickedLocation } from "../../../store/mapSlice"; // ✅ Redux 액션 불러오기
import Modal from "../../../components/modal/Modal";
import { fetchPOIData } from "../api/poiService"; // ✅ POI 데이터 가져오는 함수
import CustomMarker from "../../map/marker/CustomMarker"; // ✅ 커스텀 마커 컴포넌트 추가

const POIHandler = ({ mapRef }) => {
  const dispatch = useDispatch();

  // ✅ Redux에서 클릭한 위치 가져오기
  const { clickedLat, clickedLng, clickedZoom } = useSelector((state) => state.map);
  
  const [selectedPOI, setSelectedPOI] = useState(null);
  const geocoder = new kakao.maps.services.Geocoder(); // ✅ 주소 변환을 위한 Geocoder 객체

  // ✅ 클릭 시 Redux에 위치 저장 & POI 데이터 가져오기
  const handlePOIClick = async (mouseEvent) => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const lat = mouseEvent.latLng.getLat();
    const lng = mouseEvent.latLng.getLng();
    const zoom = map.getLevel();

    console.log(`📍 클릭 위치: (${lat}, ${lng}), 줌 레벨: ${zoom}`);

    // ✅ Redux에 클릭한 위치 저장
    dispatch(setClickedLocation({ lat, lng, zoom }));

    // ✅ 도로명 주소 변환 요청
    geocoder.coord2Address(lng, lat, async (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        let address = result[0]?.road_address?.address_name || "주소 정보 없음";

        // ✅ POI 데이터 가져오기
        const { nearestPOI } = await fetchPOIData({ Lat: lat, Lng: lng }, zoom);

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

  // ✅ 모달 닫힐 때 클릭된 위치 초기화
  const handleModalClose = () => {
    setSelectedPOI(null);
    dispatch(setClickedLocation({ lat: null, lng: null, zoom: null })); // ✅ Redux에서 클릭된 위치 삭제
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
      {/* ✅ Redux에서 가져온 클릭 위치를 CustomMarker로 전달 */}
      {clickedLat && clickedLng && (
        <CustomMarker mapRef={mapRef} center={{ Lat: clickedLat, Lng: clickedLng }} />
      )}
      
      {/* ✅ POI 정보가 있을 때 모달 표시 */}
      {selectedPOI && (
        <Modal
          place={selectedPOI}
          onClose={handleModalClose} // ✅ 모달 닫힐 때 Redux 상태 초기화
        />
      )}
    </>
  );
};

export default POIHandler;
