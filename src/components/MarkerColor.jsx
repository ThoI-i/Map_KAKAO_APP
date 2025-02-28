export const getCustomMarker = (color, icon) => {
  if (!color) color = "#36c991"; // ✅ 기본 색상 초록색
  if (!icon) icon = "★"; // ✅ 기본 아이콘

  const svg = `
    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="20" fill="${color}" stroke="black" stroke-width="2"/>
      <text x="50%" y="55%" text-anchor="middle" font-size="16" fill="white" font-weight="bold">${icon}</text>
    </svg>
  `;

  return new kakao.maps.MarkerImage(
    `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    new kakao.maps.Size(50, 50),
    { offset: new kakao.maps.Point(25, 50) }
  );
};
