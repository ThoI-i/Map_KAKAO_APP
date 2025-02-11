import { useEffect, useState } from 'react';
import Modal from './Modal';

function ValidationHandler({ mapRef }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [clickData, setClickData] = useState({ lat: 0, lng: 0, address: '' });

  useEffect(() => {
    if (mapRef.current) {
      kakao.maps.event.addListener(mapRef.current, 'click', async (mouseEvent) => {
        const latLng = mouseEvent.latLng;

        // 클릭 위치 정보 설정
        const positionData = {
          lat: latLng.getLat(),
          lng: latLng.getLng(),
          address: await getAddressFromCoords(latLng),  // 주소 정보 가져오기
        };

        setClickData(positionData);
        setModalVisible(true);
      });
    }
  }, [mapRef]);

  // 좌표로 주소 정보를 가져오는 함수
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

  return (
    <>
      {modalVisible && (
        <Modal
          clickData={clickData}
          onClose={() => setModalVisible(false)}
          onSave={(color) => {
            console.log('저장된 데이터:', clickData, color);
            setModalVisible(false);
          }}
        />
      )}
    </>
  );
}

export default ValidationHandler;
