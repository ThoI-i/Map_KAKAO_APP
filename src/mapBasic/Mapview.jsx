import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import POILoader from "./POILoader";
import POIHandler from "./POIHandler";

function MapView() {
  const mapRef = useRef(null);
  const [selectedPOI, setSelectedPOI] = useState(null); // 선택된 POI 정보 저장

  return (
    <div id="map" style={styles.map}>
      <POILoader mapRef={mapRef} setSelectedPOI={setSelectedPOI} /> {/* ? POILoader가 모든 지도 로직을 담당 */}
      <POIHandler selectedPOI={selectedPOI} /> {/* ? 선택된 POI를 POIHandler에 전달하여 처리 */}
      {selectedPOI && <Modal place={selectedPOI} onClose={() => setSelectedPOI(null)} />}
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