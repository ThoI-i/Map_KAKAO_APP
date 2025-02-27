import { useEffect, useRef, useState } from 'react';
import ValidationHandler from './ValidationHandler';

function MapView() {
  const mapRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLatLng, setSelectedLatLng] = useState(null);
  const [markers, setMarkers] = useState([]); // 저장된 마커 리스트
  const [tempMarker, setTempMarker] = useState(null); // 모달이 열리는 동안만 있는 임시 마커

  // ✅ 로컬스토리지에서 마커 좌표 불러오기
  const loadMarkersFromStorage = () => {
    const savedMarkers = JSON.parse(localStorage.getItem('savedMarkers')) || [];
    return savedMarkers;
  };

  // ✅ 로컬스토리지에 마커 좌표 저장
  const saveMarkersToStorage = (newMarker) => {
    const savedMarkers = loadMarkersFromStorage();
    const updatedMarkers = [...savedMarkers, newMarker]; // 기존 리스트에 추가
    localStorage.setItem('savedMarkers', JSON.stringify(updatedMarkers));
  };

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 3,
      };

      if (!mapRef.current) {
        mapRef.current = new window.kakao.maps.Map(container, options);
        kakao.maps.event.addListener(mapRef.current, 'click', handleMapClick);
      }

      // ✅ 저장된 마커 불러오기
      const storedMarkers = loadMarkersFromStorage();
      storedMarkers.forEach(({ lat, lng }) => {
        new kakao.maps.Marker({
          position: new kakao.maps.LatLng(lat, lng),
          map: mapRef.current,
        });
      });

      setMarkers(storedMarkers);
    }
  }, []);

  // ✅ 지도 클릭 시 임시 마커 표시 & 모달 열기
  const handleMapClick = (mouseEvent) => {
    console.log('지도 클릭됨!', mouseEvent.latLng);
    const latlng = mouseEvent.latLng;
    setSelectedLatLng(latlng);

    // ✅ 기존 임시 마커 제거
    if (tempMarker) {
      tempMarker.setMap(null);
      setTempMarker(null);
    }

    // ✅ 새 임시 마커 생성
    const marker = new kakao.maps.Marker({
      position: latlng,
      map: mapRef.current,
    });

    setTempMarker(marker);
    setIsModalOpen(true); // ✅ 모달 열기
  };

  // ✅ 저장 버튼 클릭 시 마커 영구 저장
  const handleSaveMarker = () => {
    if (!tempMarker || !selectedLatLng) {
      console.error('마커 저장 실패: 임시 마커 또는 위치 정보 없음');
      return;
    }

    console.log('마커 저장됨:', selectedLatLng);

    // ✅ 로컬스토리지에 저장
    const newMarker = { lat: selectedLatLng.getLat(), lng: selectedLatLng.getLng() };
    saveMarkersToStorage(newMarker);

    // ✅ 저장된 마커를 다시 불러와서 렌더링
    setMarkers((prev) => [...prev, newMarker]);

    setTempMarker(null); // ✅ 임시 마커 초기화
    setIsModalOpen(false); // ✅ 모달 닫기
  };

  // ✅ 취소 버튼 클릭 시 임시 마커 삭제
  const handleCancel = () => {
    console.log('취소 버튼 클릭됨, 임시 마커 삭제');

    if (tempMarker) {
      tempMarker.setMap(null); // ✅ 지도에서 제거
      setTempMarker(null); // ✅ 상태 초기화
    }

    setSelectedLatLng(null);
    setIsModalOpen(false);
  };

  return (
    <div id="map" style={styles.map}>
      <ValidationHandler mapRef={mapRef} />
      
      {isModalOpen && (
        <div className="modal">
          <p>마커를 저장할까요?</p>
          <button onClick={handleSaveMarker}>저장</button>
          <button onClick={handleCancel}>취소</button>
        </div>
      )}
    </div>
  );
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
