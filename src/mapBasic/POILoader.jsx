import { useEffect } from "react";

function POILoader({ mapRef, setSelectedPOI }) {
  useEffect(() => {
    if (!mapRef?.current) return;

    const map = mapRef.current;
    const places = new kakao.maps.services.Places();

    // ? 검색할 카테고리 리스트 (카카오 API 제공 카테고리)
    const categoryCodes = ["FD6", "CE7", "MT1", "CS2", "SW8", "BK9", "OL7", "PO3", "AT4", "AD5", "SC4"];

    // Map Level에 따라 radius 변경 함수
    const getRadiusByLevel = (level) => { 
     // 자바스크립트 key:value 형태의 객체
      const radiusMapping = { 1: 20, 2: 50, 3: 100, 4: 200, 5: 500, 6: 1000, 7: 2000, 8: 5000, 9: 10000};
      return radiusMapping[level] || 500; // 기본값 500m
    };

    // Map Level 변경 시 Console 로그 확인
    kakao.maps.event.addListener(map, "zoom_changed", () => { 
      console.log("Current Map Level:", map.getLevel()); // ? 현재 Map Level 확인
    });

    // 기존 이벤트 리스너 제거 (중복 생성 방지)
    kakao.maps.event.removeListener(map, "click");

    // ? 클릭한 좌표에서 여러 카테고리의 POI 검색
    const handleMapClick = (mouseEvent) => {
      const lat = mouseEvent.latLng.getLat();
      const lng = mouseEvent.latLng.getLng();
      const currentLevel = map.getLevel(); // ? 현재 Map Level 가져오기 KAKAO API
      const radius = getRadiusByLevel(currentLevel); // ? 현재 레벨에 맞는 Radius 설정

      console.log("Current Map Level:", currentLevel, "Radius Setting:", radius); // ? 디버깅용 로그

      // ? 여러 카테고리에 대한 검색을 동시에 실행하기 위해 `Promise.all()` 사용
      const searchPromises = categoryCodes.map(category =>
        new Promise((resolve) => {
          places.categorySearch(category, (result, status) => {
            if (status === kakao.maps.services.Status.OK && result.length > 0) {
              resolve(result); // ? 검새 결과 O: 해당 카테고리의 검색된 결과 반환
            } else {
              resolve([]); // ? 검색 결과 X: 빈배열 반환
            }
          }, {
            location: new kakao.maps.LatLng(lat, lng),
            radius, // ? 동적으로 Radius 설정!
          });
        })
      );

      // 모든 카테고리의 검색이 끝난 후 실행
      Promise.all(searchPromises).then(results => {
        const allPOIs = results.flat(); // 여러 카테고리 결과를 하나의 배열로 합침
        console.log("검색된 모든 POI:", allPOIs); // 모든 검색 결과 출력 (디버깅)

        if (allPOIs.length > 0) {
          // 클릭한 위치 중 가장 가까운 POI 조회
          const closestPOI = allPOIs.reduce((prev, curr) => {
            const prevDist = Math.sqrt((lat - parseFloat(prev.y)) ** 2 + (lng - parseFloat(prev.x)) ** 2);
            const currDist = Math.sqrt((lat - parseFloat(curr.y)) ** 2 + (lng - parseFloat(curr.x)) ** 2);
            return currDist < prevDist ? curr : prev;
          });

          setSelectedPOI(closestPOI); // 가장 가까운 POI 선택
        } else {
          setSelectedPOI(null); // 검색된 POI가 없으면 모달창 닫기
        }
      });
    };

    // 클릭 이벤트 리스너 추가
    kakao.maps.event.addListener(map, "click", handleMapClick);

// 컴포넌트 언마운트 시 리스너 제거 Cleanup(정리) 함수
    // ㄴPOIHandler 컴포넌트 종료 시 → 자동 실행(Unmount)
    return () => {
      kakao.maps.event.removeListener(map, "click", handleClick);
    };


  }, [mapRef, setSelectedPOI]);

  return null;
}

export default POILoader;