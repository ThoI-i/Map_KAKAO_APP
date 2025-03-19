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
    markerDiv.className = "modal-result-display";
    markerDiv.style.backgroundColor = selectedColor;
    markerDiv.innerText = selectedIcon;

    const newOverlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(center.Lat, center.Lng),
      content: markerDiv,
      yAnchor: 1.0,
    });

    newOverlay.setMap(map);
    setOverlay(newOverlay);

    return () => newOverlay.setMap(null);
  }, [mapRef, center, selectedColor, selectedIcon]);

  return null;
};

export default CustomMarker;
