export const fetchPOIData = async (lat, lng, zoomLevel) => {
  return new Promise((resolve) => {
    const places = new kakao.maps.services.Places();

    const getRadiusByLevel = (level) => {
      const radiusMapping = {
        1: 20, 2: 50, 3: 100, 4: 200, 5: 500,
        6: 1000, 7: 2000, 8: 5000, 9: 10000
      };
      return radiusMapping[level] || 500;
    };

    const radius = getRadiusByLevel(zoomLevel);
    console.log(`🔍 검색 반경: ${radius}m`);

    const categoryCodes = ["FD6", "CE7", "MT1", "CS2", "SW8", "BK9", "OL7", "PO3", "AT4", "AD5", "SC4"];

    const searchPromises = categoryCodes.map(category =>
      new Promise((resolve) => {
        places.categorySearch(category, (result, status) => {
          resolve(status === kakao.maps.services.Status.OK ? result : []);
        }, {
          location: new kakao.maps.LatLng(lat, lng),
          radius,
        });
      })
    );

    Promise.all(searchPromises).then(results => {
      const allPOIs = results.flat();
      console.log("🔍 검색된 최신 POI:", allPOIs);
      resolve(allPOIs);
    });
  });
};
