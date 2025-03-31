import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClickedLocation } from "../../../store/mapSlice";
import {
  setNearestPOI,
  clearNearestPOI,
  openModal,
  closeModal,
} from "../../../store/poiSlice";
import Modal from "../../../components/modal/Modal";
import { fetchPOIData } from "../api/poiService";
import CustomMarker from "../../map/marker/CustomMarker";
import POIDetailContent from "../components/POIDetailContent";

const POIHandler = ({ mapRef }) => {
  const dispatch = useDispatch();
  const { clickedLat, clickedLng, clickedZoom } = useSelector(
    (state) => state.map
  );
  const { nearestPOI, isModalOpen } = useSelector((state) => state.poi);
  const geocoder = new kakao.maps.services.Geocoder();

  const handlePOIClick = async (mouseEvent) => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const lat = mouseEvent.latLng.getLat();
    const lng = mouseEvent.latLng.getLng();
    const zoom = map.getLevel();

    dispatch(setClickedLocation({ lat, lng, zoom }));

    geocoder.coord2Address(lng, lat, async (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const { nearestPOI } = await fetchPOIData({ Lat: lat, Lng: lng }, zoom);
        if (nearestPOI) {
          dispatch(setNearestPOI(nearestPOI));
          dispatch(openModal());
        }
      }
    });
  };

  const handleModalClose = () => {
    dispatch(closeModal());
    dispatch(clearNearestPOI());
    dispatch(setClickedLocation({ lat: null, lng: null, zoom: null }));
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // ✅ 더블 클릭 확대 방지
    const blockDoubleClick = () => false;

    kakao.maps.event.addListener(map, 'dblclick', blockDoubleClick);

    // ✅ 클릭 이벤트(POI 처리)
    kakao.maps.event.addListener(map, "click", handlePOIClick);

    return () => {
      kakao.maps.event.removeListener(map, 'dblclick', blockDoubleClick);
      kakao.maps.event.removeListener(map, "click", handlePOIClick);
    };
  }, [mapRef]);

  return (
    <>
      {clickedLat && clickedLng && (
        <CustomMarker
          mapRef={mapRef}
          center={{ Lat: clickedLat, Lng: clickedLng }}
        />
      )}

      {/* ✅ Redux 상태 기반으로 Portal Modal 작동 */}
      <Modal visible={isModalOpen && !!nearestPOI} onClose={handleModalClose}>
        <POIDetailContent place={nearestPOI} onClose={handleModalClose} />
      </Modal>
    </>
  );
};

export default POIHandler;
