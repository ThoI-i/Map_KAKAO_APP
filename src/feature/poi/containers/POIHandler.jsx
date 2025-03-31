// ✅ POIHandler.jsx - 모달 렌더링 + 디버깅 추가 버전
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClickedLocation } from "../../../store/mapSlice";
import Modal from "../../../components/modal/Modal";
import { fetchPOIData } from "../api/poiService";
import CustomMarker from "../../map/marker/CustomMarker";
import POIDetailContent from "../components/POIDetailContent";

const POIHandler = ({ mapRef }) => {
  const dispatch = useDispatch();

  const { clickedLat, clickedLng, clickedZoom } = useSelector(
    (state) => state.map
  );

  const [selectedPOI, setSelectedPOI] = useState(null);
  const geocoder = new kakao.maps.services.Geocoder();

  const handlePOIClick = async (mouseEvent) => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const lat = mouseEvent.latLng.getLat();
    const lng = mouseEvent.latLng.getLng();
    const zoom = map.getLevel();

    console.log(`📍 클릭 위치: (${lat}, ${lng}), 줌 레벨: ${zoom}`);

    dispatch(setClickedLocation({ lat, lng, zoom }));

    geocoder.coord2Address(lng, lat, async (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        let address = result[0]?.road_address?.address_name || "주소 정보 없음";

        const { nearestPOI } = await fetchPOIData({ Lat: lat, Lng: lng }, zoom);

        // ✅ 디버깅 조건 추가
        if (nearestPOI) {
          console.log("✅ 선택된 POI:", nearestPOI);
          setSelectedPOI(nearestPOI);
        } else {
          console.warn("❌ nearestPOI 없음! setSelectedPOI 실행 안 됨");
        }
      }
    });
  };

  const handleModalClose = () => {
    setSelectedPOI(null);
    dispatch(setClickedLocation({ lat: null, lng: null, zoom: null }));
  };

  useEffect(() => {
    console.log("🟢 [POIHandler] selectedPOI 상태:", selectedPOI);
    if (!mapRef.current) return;
    const map = mapRef.current;
    kakao.maps.event.addListener(map, "click", handlePOIClick);

    return () => {
      kakao.maps.event.removeListener(map, "click", handlePOIClick);
    };
  }, [mapRef, selectedPOI]);

  return (
    <>
      {clickedLat && clickedLng && (
        <CustomMarker
          mapRef={mapRef}
          center={{ Lat: clickedLat, Lng: clickedLng }}
        />
      )}

      {/* ✅ 모달 렌더링 추가 */}
      <Modal visible={!!selectedPOI} onClose={handleModalClose}>
        <POIDetailContent place={selectedPOI} onClose={handleModalClose} />
      </Modal>
    </>
  );
};

export default POIHandler;
