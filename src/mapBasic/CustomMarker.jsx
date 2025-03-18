import { useEffect, useState } from "react";
import { useSelector } from "react-redux";  // ✅ Redux 상태 가져오기

const CustomMarker = ({ mapRef, center }) => {
  const [overlay, setOverlay] = useState(null);

  // ✅ Redux에서 선택한 색상 & 아이콘 가져오기
  const selectedColor = useSelector((state) => state.marker.color);
  const selectedIcon = useSelector((state) => state.marker.icon);

  useEffect(() => {
    if (!mapRef.current || !center) return;

    const map = mapRef.current;

    // 기존 오버레이 삭제
    if (overlay) {
      overlay.setMap(null);
    }

    // 커스텀 마커 (modal-result-display 스타일 적용)
    const markerDiv = document.createElement("div");
    markerDiv.className = "modal-result-display";
    markerDiv.style.width = "30px";
    markerDiv.style.height = "30px";
    markerDiv.style.backgroundColor = selectedColor; // ✅ Redux 상태 적용
    markerDiv.style.borderRadius = "50%";
    markerDiv.style.textAlign = "center";
    markerDiv.style.lineHeight = "30px";
    markerDiv.style.color = "white";
    markerDiv.style.fontSize = "16px";
    markerDiv.innerText = selectedIcon; // ✅ Redux 상태 적용

    // 카카오 커스텀 오버레이 생성
    const newOverlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(center.Lat, center.Lng),
      content: markerDiv,
      yAnchor: 1.0,
    });

    // 지도에 마커 추가
    newOverlay.setMap(map);
    setOverlay(newOverlay);

    return () => {
      newOverlay.setMap(null); // ✅ 언마운트 시 마커 삭제
    };
  }, [mapRef, center, selectedColor, selectedIcon]); // Redux 상태 변화 감지

  return null; // ✅ JSX 반환 X → 지도에 직접 렌더링
};

export default CustomMarker;
