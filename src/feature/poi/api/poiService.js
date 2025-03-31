const getClickedAddress = async (lat, lng) => {
  return new Promise((resolve) => {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const address =
          result[0]?.road_address?.address_name || "주소 정보 없음";
        resolve(address);
      } else {
        resolve("주소 정보 없음");
      }
    });
  });
};


export const fetchPOIData = async (center, zoomLevel) => {
  return new Promise((resolve) => {
    const places = new kakao.maps.services.Places();
    
    // ? center를 kakao.maps.LatLng 객체로 변환
    const centerLatLng = new kakao.maps.LatLng(center.Lat, center.Lng);

    // ? 줌 레벨별 검색 가능한 카테고리 목록 (기존 코드 유지)
    const categoryByZoom = {
      1: ["FD6", "CE7", "MT1", "CS2", "SW8", "BK9", "OL7", "PO3", "AT4", "AD5", "SC4"], // ? 모든 카테고리 허용
      2: ["FD6", "CE7", "MT1", "CS2", "SW8", "BK9", "OL7", "PO3", "AT4", "AD5", "SC4"], // ? 모든 카테고리 허용
      3: ["CE7", "MT1", "CS2", "SW8", "BK9", "OL7", "PO3", "AT4", "AD5", "SC4"], // ? 음식점(FD6) 제외
      4: ["SW8", "MT1", "PO3", "SC4", "AT4"], // ? 지하철, 대형마트, 관광명소, 학교, 문화시설만
      5: ["SW8", "MT1", "PO3", "SC4"], // ? 지하철, 대형마트, 관광명소, 학교만
      6: ["SW8", "MT1", "PO3", "SC4"], // ? 지하철, 대형마트, 관광명소, 학교만
      7: ["SW8"], // ? 지하철만
    };

    // ? 지도 레벨별 반경 설정 함수 (기존 코드 유지)
    const getRadiusByZoom = (zoomLevel) => {
      const radiusByZoom = {
          1: 6,   // 줌 레벨 1 → 반경 6m
          2: 15,  // 줌 레벨 2 → 반경 15m
          3: 15,  // 줌 레벨 3 → 반경 15m
          4: 30,  // 줌 레벨 4 → 반경 30m
          5: 50,  // 줌 레벨 5 → 반경 50m
          6: 100,  // 줌 레벨 6 → 반경 100m
          7: 300, // 줌 레벨 7 → 반경 300m
        };
      return radiusByZoom[zoomLevel] || 500; // 기본값 500m
    };

    // ? 줌 레벨별 카테고리 가져오기 
    const getCategoriesByZoom = (zoomLevel) => categoryByZoom[zoomLevel] || [];

    // ? 8 이상일 경우 빈 배열 반환 
    const categoryCodes = getCategoriesByZoom(zoomLevel);
    if (categoryCodes.length === 0) {
      console.log(`?? 줌 레벨 ${zoomLevel}: POI 검색 비활성화`);
      resolve({ center, zoomLevel, allPOIs: [], nearestPOI: null });
      return;
    }

    // ? 반경 설정 
    const radius = getRadiusByZoom(zoomLevel);
    console.log(`?? 현재 줌 레벨: ${zoomLevel}, 반경: ${radius}m, 허용된 카테고리: ${categoryCodes.join(", ")}`);

    // ? 클릭한 위치 반경 내 POI 검색 
    const searchPromises = categoryCodes.map(category =>
      new Promise((resolve) => {
        places.categorySearch(category, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            resolve(
              result
                .filter(poi => poi.category_group_name) // ? POI 아이콘이 있는 데이터만 유지
                .map(poi => ({ ...poi, zoomLevel }))
            );
          } else {
            resolve([]);
          }
        }, { location: centerLatLng, radius }); // ? centerLatLng을 사용
      })
    );

    // ? POI 검색 결과 처리
    Promise.all(searchPromises).then(async results => {
      let allPOIs = results.flat(); // ? 모든 POI 합치기

      // ? 가장 가까운 POI 찾기 추가
      let nearestPOI = null;
      if (allPOIs.length > 0) {
        nearestPOI = allPOIs.reduce((closest, poi) => {
          const poiLatLng = new kakao.maps.LatLng(parseFloat(poi.y), parseFloat(poi.x));
          const poiDistance = getDistance(centerLatLng, poiLatLng);
          return poiDistance < closest.distance ? { ...poi, distance: poiDistance } : closest;
        }, { ...allPOIs[0], distance: getDistance(centerLatLng, new kakao.maps.LatLng(parseFloat(allPOIs[0].y), parseFloat(allPOIs[0].x))) });
      } else { // ✅ POI가 없을 경우 기본 정보 구성
        const address = await getClickedAddress(center.Lat, center.Lng);
        nearestPOI = {
          place_name: "커스텀 위치",
          address_name: address,
          phone: "",
          category_group_name: "",
          distance: ""
        };
      resolve({nearestPOI }); // ✅ nearestPOI만 반환
      }
    })
  })
};

/**
 * ? 두 좌표 간 거리 계산 (단위: m)
 */
const getDistance = (pos1, pos2) => {
  const R = 6371e3; // 지구 반지름 (m)
  const lat1 = pos1.getLat() * (Math.PI / 180);

  const lat2 = pos2.getLat() * (Math.PI / 180);
  const deltaLat = (pos2.getLat() - pos1.getLat()) * (Math.PI / 180);
  const deltaLng = (pos2.getLng() - pos1.getLng()) * (Math.PI / 180);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c); // 거리 반환 (m, 소수점 제거)
};