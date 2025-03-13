import React, { useRef, useState } from "react";
import usePOILoader from "./usePOILoader";
import POIHandler from "./POIHandler";

const MapView = () => {
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [pois, setPois] = useState([]); // ✅ 최신 POI 데이터를 저장할 상태 추가

  usePOILoader(mapRef, setIsMapLoaded); // ✅ 지도 로딩 처리

  return (
    <div id="map" style={{ width: "100vw", height: "100vh" }}>
      {isMapLoaded && <POIHandler mapRef={mapRef} pois={pois} setPois={setPois} />} 
    </div>
  );
};

export default MapView;
