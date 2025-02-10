import { useState } from 'react';

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (place) => {
    if (favorites.some((fav) => fav.id === place.id)) {
      alert('이미 즐겨찾기에 추가된 장소입니다.');
      return;
    }
    setFavorites([...favorites, place]);
  };

  return (
    <div>
      <h2>즐겨찾기 목록</h2>
      {favorites.length === 0 ? (
        <p>즐겨찾기한 장소가 없습니다.</p>
      ) : (
        favorites.map((place) => (
          <div key={place.id}>
            <h3>{place.place_name}</h3>
            <p>{place.address_name}</p>
          </div>
        ))
      )}

      {/* 테스트용 버튼 */}
      <button onClick={() => addFavorite({ id: 1, place_name: '테스트 장소', address_name: '서울특별시' })}>
        테스트 장소 추가
      </button>
    </div>
  );
}

export default Favorites;
