import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import POILoader from "./POILoader";
import POIHandler from "./POIHandler";

function MapView() {
  const mapRef = useRef(null);
  const [selectedPOI, setSelectedPOI] = useState(null); // ✅ 선택된 POI 정보 저장

  useEffect(() => {
    if (!mapRef.current) {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 3,
      };
      mapRef.current = new window.kakao.maps.Map(container, options);
    }
  }, []);

  return (
    <div id="map" style={styles.map}>
      <POILoader mapRef={mapRef} setSelectedPOI={setSelectedPOI} /> {/* ✅ 클릭한 위치에서 POI 검색 */}
      <POIHandler selectedPOI={selectedPOI} /> {/* ✅ 선택된 POI 처리 */}
      {selectedPOI && <Modal place={selectedPOI} onClose={() => setSelectedPOI(null)} />} {/* ✅ POI 정보 표시 */}
    </div>
  );
}

const styles = {
  map: {
    width: "100vw",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 0,
  },
};

export default MapView;
