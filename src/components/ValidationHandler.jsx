import { useState, useEffect } from 'react';
import Modal from './Modal';

function ValidationHandler({ mapRef }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [clickData, setClickData] = useState({ lat: 0, lng: 0, address: '', placeName: '', category: '' });

  useEffect(() => {
    if (mapRef.current) {
      console.log('지도 객체 생성 완료:', mapRef.current);

      // 확대/축소 이벤트 처리
      kakao.maps.event.addListener(mapRef.current, 'zoom_changed', () => {
        console.log('확대/축소 이벤트 발생');
        mapRef.current.relayout();
      });

      // 타일 로드 이벤트 처리
      kakao.maps.event.addListener(mapRef.current, 'tilesloaded', saveMapCache);

      // 지도 클릭 이벤트 처리
      kakao.maps.event.addListener(mapRef.current, 'click', async (mouseEvent) => {
        const latLng = mouseEvent.latLng;

        const positionData = {
          lat: latLng.getLat(),
          lng: latLng.getLng(),
          address: await getAddressFromCoords(latLng),
        };

        const placeData = await getPlaceData(latLng);
        if (placeData) {
          positionData.placeName = placeData.place_name;
          positionData.category = placeData.category_group_name;
        }

        setClickData(positionData);
        setModalVisible(true);
      });
    }
  }, [mapRef]);

  // 주소 정보 가져오기
  const getAddressFromCoords = (latLng) => {
    return new Promise((resolve) => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.coord2Address(latLng.getLng(), latLng.getLat(), (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          resolve(result[0].address.address_name);
        } else {
          resolve('주소 정보를 불러올 수 없음');
        }
      });
    });
  };

  // 장소 데이터 가져오기
  const getPlaceData = (latLng) => {
    return new Promise((resolve) => {
      const places = new window.kakao.maps.services.Places();
      places.categorySearch('AT4', (result, status) => {
        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
          resolve(result[0]);
        } else {
          resolve(null);
        }
      }, {
        location: latLng,
        radius: 50,
      });
    });
  };

  // 캐시 저장 함수
  const saveMapCache = () => {
    if (!mapRef.current) return;

    const center = mapRef.current.getCenter();
    const level = mapRef.current.getLevel();

    const cacheData = {
      center: { lat: center.getLat(), lng: center.getLng() },
      level,
    };

    try {
      localStorage.setItem('mapCache', JSON.stringify(cacheData));
      console.log('지도 캐시 저장 완료');
    } catch (error) {
      console.error('지도 캐시 저장 실패:', error);
    }
  };

  return (
    <>
      {modalVisible && (
        <Modal
          clickData={clickData}
          onClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
}

export default ValidationHandler;