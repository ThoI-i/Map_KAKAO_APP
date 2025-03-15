export const fetchPOIData = async (center, zoomLevel) => {
  return new Promise((resolve) => {
    const places = new kakao.maps.services.Places();
    const categoryCodes = ["FD6", "CE7", "MT1", "CS2", "SW8", "BK9", "OL7", "PO3", "AT4", "AD5", "SC4"];

    // ✅ 지도 레벨별 반경 설정
    const radius = getRadiusByZoom(zoomLevel);
    console.log(`📌 현재 줌 레벨: ${zoomLevel}, 반경 설정: ${radius}m`);

    // ✅ 클릭한 위치 반경 내 POI 검색
    const searchPromises = categoryCodes.map(category =>
      new Promise((resolve) => {
        places.categorySearch(category, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            resolve(
              result
                .filter(poi => poi.category_group_name) // ✅ POI 아이콘이 있는 데이터만 유지
                .map(poi => ({
                  ...poi,
                  hasIcon: true, // ✅ POI 아이콘 존재 여부 추가
                  zoomLevel, // ✅ 현재 줌 레벨 추가
                }))
            );
          } else {
            resolve([]);
          }
        }, { location: center, radius });
      })
    );

    Promise.all(searchPromises).then(results => {
      let allPOIs = results.flat();
      resolve(allPOIs);
    });
  });
};

/**
 * ✅ 지도 레벨별 반경 설정 함수
 */
const getRadiusByZoom = (zoomLevel) => {
  const radiusByZoom = {
    1: 6,   // 줌 레벨 1 → 반경 6m
    2: 15,  // 줌 레벨 2 → 반경 15m
    3: 30,  // 줌 레벨 3 → 반경 200m
    4: 300,  // 줌 레벨 4 → 반경 300m
    5: 500,  // 줌 레벨 5 → 반경 500m
    6: 700,  // 줌 레벨 6 → 반경 700m
    7: 1000, // 줌 레벨 7 → 반경 1000m
  };
  return radiusByZoom[zoomLevel] || 500; // 기본값 500m
};
