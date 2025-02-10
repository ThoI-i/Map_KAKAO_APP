import { useState } from 'react';

function searchPlaces(keyword) {
  const ps = new window.kakao.maps.services.Places();

  // 장소 검색 API 호출
  ps.keywordSearch(keyword, (data, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      console.log('검색 결과:', data);  // 검색 결과 출력
    } else {
      console.error('검색 실패:', status);
    }
  });
}

function SearchPlaces() {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    if (keyword.trim() === '') {
      alert('검색어를 입력해 주세요!');
      return;
    }
    searchPlaces(keyword);
  };

  return (
    <div>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
}

export default SearchPlaces;
