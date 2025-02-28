import { useEffect, useState } from 'react';
import Modal from './Modal';
import { getCustomMarker } from './MarkerColor';

function ValidationHandler({ mapRef, updateMarkers }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [clickData, setClickData] = useState({ lat: 0, lng: 0, address: '', color: '' });
  const [tempMarker, setTempMarker] = useState(null);

  // ✅ 좌표를 주소로 변환하는 함수 추가!
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

  useEffect(() => {
    if (mapRef.current) {
      kakao.maps.event.addListener(mapRef.current, 'click', async (mouseEvent) => {
        const latLng = mouseEvent.latLng;

        const positionData = {
          lat: latLng.getLat(),
          lng: latLng.getLng(),
          address: await getAddressFromCoords(latLng),
          color: '#36c991', // ✅ 기본 초록색 지정
        };

        setClickData(positionData);
        setModalVisible(true);

        // ✅ 기존 임시 마커 삭제
        if (tempMarker) {
          tempMarker.setMap(null);
          setTempMarker(null);
        }

        // ✅ 새 임시 마커 생성 (초록색 기본 마커)
        const marker = new kakao.maps.Marker({
          position: latLng,
          map: mapRef.current,
          image: getCustomMarker("#36c991"),
        });

        setTempMarker(marker);
      });
    }
  }, [mapRef]);

  // ✅ 사용자가 색상을 변경할 때 즉시 임시 마커 색상 변경
  const handleColorChange = (newColor) => {
    console.log(`색상 변경: ${newColor}`);
    setClickData(prev => ({ ...prev, color: newColor })); // ✅ 상태 업데이트

    if (tempMarker) {
      tempMarker.setMap(null); // ✅ 기존 마커 삭제
    }

    const newMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(clickData.lat, clickData.lng),
      map: mapRef.current,
      image: getCustomMarker(newColor), // ✅ 새 색상 적용된 마커
    });

    setTempMarker(newMarker); // ✅ 새로운 마커 저장
  };

  // ✅ 저장 버튼 클릭 시 로컬스토리지에 저장
  const handleSave = () => {
    console.log('저장된 데이터:', clickData);

    const nextMarkerKey = `marker${Object.keys(localStorage).filter(key => key.startsWith('marker')).length + 1}`;
    const newMarkerData = { lat: clickData.lat, lng: clickData.lng, color: clickData.color };

    localStorage.setItem(nextMarkerKey, JSON.stringify(newMarkerData));
    console.log('로컬스토리지 저장 완료:', localStorage.getItem(nextMarkerKey));

    setModalVisible(false);

    // ✅ 임시 마커 삭제 후 업데이트
    if (tempMarker) {
      tempMarker.setMap(null);
      setTimeout(() => setTempMarker(null), 100);
    }

    updateMarkers();
  };

  // ✅ 취소 버튼 클릭 시 임시 마커 삭제
  const handleCancel = () => {
    console.log('취소 버튼 클릭됨, 임시 마커 삭제');

    if (tempMarker) {
      tempMarker.setMap(null);
      setTimeout(() => setTempMarker(null), 100);
    }

    setModalVisible(false);
    updateMarkers();
  };

  return (
    <>
      {modalVisible && (
        <Modal
          clickData={clickData}
          onClose={handleCancel} // ✅ 취소 버튼 동작 변경
          onSave={handleSave}
          onColorChange={handleColorChange} // ✅ 색상 변경 핸들러 추가
        />
      )}
    </>
  );
}

export default ValidationHandler;
