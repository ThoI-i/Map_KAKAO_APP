import { useEffect, useState } from 'react';
import Modal from './Modal';

function ValidationHandler({ mapRef, updateMarkers }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [clickData, setClickData] = useState({ lat: 0, lng: 0, address: '', color: '' });

  useEffect(() => {
    if (mapRef.current) {
      kakao.maps.event.addListener(mapRef.current, 'click', async (mouseEvent) => {
        const latLng = mouseEvent.latLng;

        // 클릭 위치 정보 설정
        const positionData = {
          lat: latLng.getLat(),
          lng: latLng.getLng(),
          address: await getAddressFromCoords(latLng),
          color: '', // 기본 색상 (사용자가 선택)
        };

        setClickData(positionData);
        setModalVisible(true);
      });
    }
  }, [mapRef]);

  // ✅ 좌표로 주소 정보를 가져오는 함수
  const getAddressFromCoords = (latLng) => {
    return new Promise((resolve) => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.coord2Address(latLng.getLng(), latLng.getLat(), (result, status) => {
        if (status === kakao.maps.services.Status.OK && result[0]?.address) {
          resolve(result[0].address.address_name);
        } else {
          resolve('주소 정보를 불러올 수 없음');
        }
      });
    });
  };

  // ✅ 저장 버튼 클릭 시 로컬스토리지에 저장
  const handleSave = (color) => {
    console.log('저장된 데이터:', clickData, color);

    // ✅ `marker1`, `marker2`... 키 생성
    const nextMarkerKey = `marker${Object.keys(localStorage).filter(key => key.startsWith('marker')).length + 1}`;

    // ✅ 저장할 데이터 구성
    const newMarkerData = {
      lat: clickData.lat,
      lng: clickData.lng,
      color: color,
    };

    // ✅ 로컬스토리지 저장
    localStorage.setItem(nextMarkerKey, JSON.stringify(newMarkerData));
    console.log('로컬스토리지 저장 완료:', localStorage.getItem(nextMarkerKey));

    setModalVisible(false);
    updateMarkers(); // ✅ 저장 후 마커 업데이트
  };

  return (
    <>
      {modalVisible && (
        <Modal
          clickData={clickData}
          onClose={() => setModalVisible(false)}
          onSave={handleSave} // ✅ 색상 저장
        />
      )}
    </>
  );
}

export default ValidationHandler;
