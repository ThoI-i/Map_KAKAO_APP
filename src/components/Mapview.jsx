import { useEffect } from 'react';

function MapView() {
  useEffect(() => {
    // 카카오 지도 API가 로드되었는지 바로 확인
    if (window.kakao && window.kakao.maps) {
      console.log('카카오 지도 API 로드 완료');

      // 지도가 중복 생성되지 않도록 기존 객체를 제거하고 다시 생성
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),  // 서울 좌표
        level: 3,
      };

      // 지도 생성
      const map = new window.kakao.maps.Map(container, options);
      console.log('지도 객체 생성 완료:', map);
    } else {
      console.error('카카오 지도 API가 로드되지 않았습니다.');
    }
  }, []);  // 빈 배열로 설정해 한 번만 실행되게 설정

  return <div id="map" style={styles.map}></div>;
}

const styles = {
  map: {
    width: '100%',     // 페이지에서 너비 전체로 설정
    height: '100%',    // 높이도 전체로 설정
    position: 'relative',  // 다른 요소와의 레이아웃 겹침 방지
  },
};

export default MapView;
