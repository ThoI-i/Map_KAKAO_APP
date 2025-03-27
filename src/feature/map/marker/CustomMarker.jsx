import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CustomMarker = ({ mapRef, center }) => {
  const [overlay, setOverlay] = useState(null);
  const selectedColor = useSelector((state) => state.marker.color);
  const selectedIcon = useSelector((state) => state.marker.icon);

  useEffect(() => {
    if (!mapRef.current || !center) return;

    const map = mapRef.current;

    if (overlay) {
      overlay.setMap(null);
    }

    const markerDiv = document.createElement("div");
    markerDiv.style.backgroundColor = selectedColor;
    markerDiv.style.position = "absolute";
    markerDiv.style.display = "flex";
    markerDiv.style.alignItems = "center";
    markerDiv.style.justifyContent = "center";
    markerDiv.style.width = "20px";
    markerDiv.style.height = "20px";
    markerDiv.style.borderRadius = "50%";
    markerDiv.style.color = "white";
    markerDiv.style.fontSize = "13px";
    markerDiv.style.lineHeight = "13px";
    markerDiv.style.textAlign = "center";
    markerDiv.style.transform = "translate(-50%, -50%)"; // 🎯 클릭한 위치가 정확히 중앙!
    markerDiv.innerText = selectedIcon;
    

    const newOverlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(center.Lat, center.Lng),
      content: markerDiv,
      yAnchor: 0.5,
      xAnchor: 0.5,
    });

    newOverlay.setMap(map);
    setOverlay(newOverlay);

    return () => newOverlay.setMap(null);
  }, [mapRef, center, selectedColor, selectedIcon]);

  return null;
};

export default CustomMarker;
