import React from 'react';

function Sidebar({ onTabChange }) {
  return (
    <div style={styles.sidebar}>
      <h3 style={styles.title}>메뉴</h3>
      <ul style={styles.menu}>
        <li style={styles.menuItem} onClick={() => onTabChange('map')}>지도 보기</li>
        <li style={styles.menuItem} onClick={() => onTabChange('search')}>장소 검색</li>
        <li style={styles.menuItem} onClick={() => onTabChange('favorites')}>즐겨찾기</li>
        <li style={styles.menuItem} onClick={() => onTabChange('login')}>로그인</li>
      </ul>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '200px',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',  // 검은색에 투명도 적용
    color: 'white',                         // 텍스트 색을 흰색으로 변경
    padding: '10px',
    position: 'fixed',
    left: 0,
    top: 0,
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.5)',
    zIndex: 1,  // 지도 위에 위치
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  menuItem: {
    padding: '10px 0',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  menuItemHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',  // 마우스 올렸을 때 효과
  },
};

export default Sidebar;
