import { useEffect, useRef, useState } from "react";
import POILoader from "./POILoader";
import POIHandler from "./POIHandler";
import ZoomLevel from "./ZoomLevel";

function MapView() {
  const mapRef = useRef(null);
  const [pois, setPois] = useState([]); // ✅ 현재 보이는 POI 데이터

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
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
      <ZoomLevel mapRef={mapRef} />
      <POILoader mapRef={mapRef} setPois={setPois} />
      <POIHandler mapRef={mapRef} pois={pois} />
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
