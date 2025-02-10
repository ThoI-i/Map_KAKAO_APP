import { useEffect, useRef } from 'react';

function MapView() {
  const mapRef = useRef(null);  // 지도 객체를 참조하기 위한 ref

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById('map');

      // 지도 초기 설정
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),  // 서울 좌표
        level: 3,
      };

      // 지도 생성 및 객체 저장 (초기 1회만 실행)
      if (!mapRef.current) {
        mapRef.current = new window.kakao.maps.Map(container, options);
        console.log('지도 객체 생성 완료:', mapRef.current);
      }

      // 지도 이벤트 추가: 확대/축소 후 상태 유지
      window.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
          e.preventDefault();  // Ctrl + 휠 시 페이지 확대 방지
        }
      }, { passive: false });

      // 컴포넌트가 언마운트될 때 이벤트 제거
      return () => {
        window.removeEventListener('wheel', (e) => {
          if (e.ctrlKey) e.preventDefault();
        });
      };
    } else {
      console.error('카카오 지도 API가 로드되지 않았습니다.');
    }
  }, []);

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
