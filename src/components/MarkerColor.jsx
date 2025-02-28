export const getMarkerColor = (color) => {
  if (!color) return null; // 색상이 없으면 기본 마커 사용

  // ✅ SVG 이미지 생성
  const svg = `
    <svg width="40" height="40" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="${color}"/>
    </svg>
  `;

  return new kakao.maps.MarkerImage(
    `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    new kakao.maps.Size(40, 40), // 이미지 크기
    { offset: new kakao.maps.Point(20, 40) } // 마커 위치 조정
  );
};
