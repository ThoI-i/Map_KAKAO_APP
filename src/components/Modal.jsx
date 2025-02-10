import React, { useState } from 'react';

function Modal({ clickData, onClose }) {
  const [favoriteColor, setFavoriteColor] = useState('');

  const handleSave = () => {
    console.log('즐겨찾기에 저장된 데이터:', {
      location: clickData,
      color: favoriteColor,
    });
    alert('즐겨찾기에 저장되었습니다!');
    onClose();  // 모달 닫기
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>위치 정보</h2>
        <p><strong>좌표:</strong> {clickData.lat}, {clickData.lng}</p>
        <p><strong>주소:</strong> {clickData.address}</p>

        <div style={styles.inputGroup}>
          <label>즐겨찾기 색상:</label>
          <input
            type="text"
            value={favoriteColor}
            onChange={(e) => setFavoriteColor(e.target.value)}
            placeholder="색상을 입력하세요"
          />
        </div>

        <div style={styles.buttonGroup}>
          <button onClick={handleSave} style={styles.saveButton}>저장</button>
          <button onClick={onClose} style={styles.closeButton}>닫기</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  inputGroup: {
    marginTop: '10px',
  },
  buttonGroup: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  closeButton: {
    backgroundColor: '#6C757D',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Modal;