// coord2Address API
export const fetchAddressFromCoords = async (lat, lng) => {
  return new Promise((resolve) => {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const addr = result[0]?.road_address?.address_name || "주소 정보 없음";
        resolve(addr);
      } else {
        resolve("주소 정보 없음");
      }
    });
  });
};
