import { useEffect, useState } from 'react';
import Modal from './Modal';
import { getCustomMarker } from './MarkerColor';

function ValidationHandler({ mapRef, updateMarkers }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [clickData, setClickData] = useState({ lat: 0, lng: 0, address: '', color: '#36c991', icon: '★' });
  const [tempMarker, setTempMarker] = useState(null);

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
        const address = await getAddressFromCoords(latLng);

        setClickData({ lat: latLng.getLat(), lng: latLng.getLng(), address, color: '#36c991', icon: '★' });
        setModalVisible(true);

        if (tempMarker) {
          tempMarker.setMap(null);
        }

        const marker = new kakao.maps.Marker({
          position: latLng,
          map: mapRef.current,
          image: getCustomMarker("#36c991", "★"),
        });

        setTempMarker(marker);
      });
    }
  }, [mapRef]);

  // ✅ 색상 변경 시 즉시 임시 마커 업데이트
  const handleColorChange = (newColor) => {
    setClickData(prev => ({ ...prev, color: newColor }));

    if (tempMarker) {
      tempMarker.setMap(null);
    }

    const newMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(clickData.lat, clickData.lng),
      map: mapRef.current,
      image: getCustomMarker(newColor, clickData.icon),
    });

    setTempMarker(newMarker);
  };

  // ✅ 아이콘 변경 시 즉시 임시 마커 업데이트
  const handleIconChange = (newIcon) => {
    setClickData(prev => ({ ...prev, icon: newIcon }));

    if (tempMarker) {
      tempMarker.setMap(null);
    }

    const newMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(clickData.lat, clickData.lng),
      map: mapRef.current,
      image: getCustomMarker(clickData.color, newIcon),
    });

    setTempMarker(newMarker);
  };

  // ✅ 저장 버튼 클릭 시 로컬스토리지에 저장 & 임시 마커 삭제
  const handleSave = (selectedColor, selectedIcon) => {
    const nextMarkerKey = `marker${Object.keys(localStorage).filter(key => key.startsWith('marker')).length + 1}`;
    localStorage.setItem(nextMarkerKey, JSON.stringify({
      lat: clickData.lat,
      lng: clickData.lng,
      color: selectedColor,
      icon: selectedIcon,
    }));

    setModalVisible(false);

    if (tempMarker) {
      tempMarker.setMap(null);
      setTempMarker(null);
    }

    updateMarkers();
  };

  // ✅ 취소 버튼 클릭 시 임시 마커 삭제
  const handleCancel = () => {
    if (tempMarker) {
      tempMarker.setMap(null);
      setTempMarker(null);
    }

    setModalVisible(false);
    updateMarkers();
  };

  return (
    <>
      {modalVisible && (
        <Modal
          clickData={clickData}
          onClose={handleCancel}
          onSave={handleSave}
          onColorChange={handleColorChange}
          onIconChange={handleIconChange} // ✅ 아이콘 변경 핸들러 추가
        />
      )}
    </>
  );
}

export default ValidationHandler;
