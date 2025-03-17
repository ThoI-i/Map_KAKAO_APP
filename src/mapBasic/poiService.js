export const fetchPOIData = async (center, zoomLevel) => {
  return new Promise((resolve) => {
    const places = new kakao.maps.services.Places();

    // ✅ 줌 레벨별 검색 가능한 카테고리 목록
    const categoryByZoom = {
      1: ["FD6", "CE7", "MT1", "CS2", "SW8", "BK9", "OL7", "PO3", "AT4", "AD5", "SC4"], // ✅ 모든 카테고리 허용
      2: ["FD6", "CE7", "MT1", "CS2", "SW8", "BK9", "OL7", "PO3", "AT4", "AD5", "SC4"], // ✅ 모든 카테고리 허용
      3: ["CE7", "MT1", "CS2", "SW8", "BK9", "OL7", "PO3", "AT4", "AD5", "SC4"], // ✅ 음식점(FD6) 제외
      4: ["SW8", "MT1", "PO3", "SC4", "AT4"], // ✅ 지하철, 대형마트, 관광명소, 학교, 문화시설만
      5: ["SW8", "MT1", "PO3", "SC4"], // ✅ 지하철, 대형마트, 관광명소, 학교만
      6: ["SW8", "MT1", "PO3", "SC4"], // ✅ 지하철, 대형마트, 관광명소, 학교만
      7: ["SW8"], // ✅ 지하철만
    };

    // ✅ 8 이상일 경우 빈 배열 반환하여 작동하지 않도록 설정
    const getCategoriesByZoom = (zoomLevel) => {
      return categoryByZoom[zoomLevel] || []; 
    };

    // ✅ 카테고리 가져오기
    const categoryCodes = getCategoriesByZoom(zoomLevel);

    // ✅ 8 이상에서는 검색을 실행하지 않도록 처리
    if (categoryCodes.length === 0) {
      console.log(`🚫 줌 레벨 ${zoomLevel}: POI 검색 비활성화`);
      resolve([]);
      return;
    }

    // ✅ 반경 설정
    const radius = getRadiusByZoom(zoomLevel);
    console.log(`📌 현재 줌 레벨: ${zoomLevel}, 반경: ${radius}m, 허용된 카테고리: ${categoryCodes.join(", ")}`);

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
    3: 15,  // 줌 레벨 3 → 반경 200m
    4: 30,  // 줌 레벨 4 → 반경 300m
    5: 50,  // 줌 레벨 5 → 반경 500m
    6: 100,  // 줌 레벨 6 → 반경 700m
    7: 300, // 줌 레벨 7 → 반경 1000m
  };
  return radiusByZoom[zoomLevel] || 500; // 기본값 500m
};
