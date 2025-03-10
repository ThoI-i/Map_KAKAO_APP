import { useEffect } from "react";

function POILoader({ mapRef, setSelectedPOI }) {
  useEffect(() => {
    if (!mapRef.current) return;

    const places = new kakao.maps.services.Places();

    // ✅ 검색할 카테고리 리스트 (카카오 API 제공 카테고리)
    const categoryCodes = [
      "FD6", "CE7", "MT1", "CS2", "SW8", "BK9", "OL7", "PO3", "AT4", "AD5", "SC4"
    ];

    // ✅ 클릭한 좌표에서 여러 카테고리의 POI 검색
    kakao.maps.event.addListener(mapRef.current, "click", (mouseEvent) => {
      const lat = mouseEvent.latLng.getLat();
      const lng = mouseEvent.latLng.getLng();
      console.log("클릭한 위치:", lat, lng); // ✅ 클릭한 좌표 확인 (디버깅용)

      // ✅ 여러 카테고리에 대한 검색을 동시에 실행하기 위해 `Promise.all()` 사용
      const searchPromises = categoryCodes.map(category =>
        new Promise((resolve) => {
          places.categorySearch(category, (result, status) => {
            if (status === kakao.maps.services.Status.OK && result.length > 0) {
              resolve(result); // ✅ 해당 카테고리에서 검색된 결과 반환
            } else {
              resolve([]); // ✅ 검색 결과가 없으면 빈 배열 반환
            }
          }, {
            location: new kakao.maps.LatLng(lat, lng),
            radius: 50, // ✅ 반경 50m 내에서 검색
          });
        })
      );

      // ✅ 모든 카테고리의 검색이 끝난 후 실행
      Promise.all(searchPromises).then(results => {
        const allPOIs = results.flat(); // ✅ 여러 카테고리의 결과를 하나의 배열로 합치기
        console.log("검색된 모든 POI:", allPOIs); // ✅ 모든 검색 결과 출력 (디버깅)

        if (allPOIs.length > 0) {
          // ✅ 클릭한 위치에서 가장 가까운 POI 찾기
          const closestPOI = allPOIs.reduce((prev, curr) => {
            const prevDist = Math.sqrt((lat - parseFloat(prev.y)) ** 2 + (lng - parseFloat(prev.x)) ** 2);
            const currDist = Math.sqrt((lat - parseFloat(curr.y)) ** 2 + (lng - parseFloat(curr.x)) ** 2);
            return currDist < prevDist ? curr : prev;
          });

          setSelectedPOI(closestPOI); // ✅ 가장 가까운 POI 선택
        } else {
          setSelectedPOI(null); // ✅ 검색된 POI가 없으면 모달창 닫기
        }
      });
    });

  }, [mapRef, setSelectedPOI]);

  return null;
}

export default POILoader;
