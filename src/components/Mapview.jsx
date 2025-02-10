import { useEffect } from 'react';

function MapView() {
  useEffect(() => {
    // 카카오 지도 API가 로드되었는지 바로 확인
    if (window.kakao && window.kakao.maps) {
      console.log('카카오 지도 API 로드 완료');

      // 지도가 중복 생성되지 않도록 기존 객체를 제거하고 다시 생성
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 3,
      };

      // 지도 생성
      const map = new window.kakao.maps.Map(container, options);
      console.log('지도 객체 생성 완료:', map);

      // 페이지 확대/축소를 막는 휠 이벤트 처리
      const handleWheel = (e) => {
        if (e.ctrlKey) {
          e.preventDefault();  // Ctrl + 휠 시 페이지 확대/축소 방지
        }
      };

      // 페이지 전체에 대한 휠 이벤트만 처리
      window.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        window.removeEventListener('wheel', handleWheel);
      };
    } else {
      console.error('카카오 지도 API가 로드되지 않았습니다.');
    }
  }, []);  // 빈 배열로 설정해 한 번만 실행되게 설정

  return <div id="map" style={styles.map}></div>;
}

const styles = {
  map: {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 0,
  },
};

export default MapView;
