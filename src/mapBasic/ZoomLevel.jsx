import { useEffect, useState } from "react";

function ZoomLevel({ mapRef }) {
  const [zoomLevel, setZoomLevel] = useState(3);

  useEffect(() => {
    if (!mapRef.current) return;

    kakao.maps.event.addListener(mapRef.current, "zoom_changed", () => {
      setZoomLevel(mapRef.current.getLevel()); // ✅ 현재 줌 레벨 업데이트
    });
  }, [mapRef]);

  return (
    <div style={styles.zoomInfo}>
      <strong>현재 줌 레벨: {zoomLevel}</strong>
    </div>
  );
}

const styles = {
  zoomInfo: {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "rgba(255, 255, 255, 0.8)",
    padding: "10px",
    borderRadius: "5px",
    zIndex: 1000,
  },
};

export default ZoomLevel;
