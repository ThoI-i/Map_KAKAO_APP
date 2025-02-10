import React, { useState } from 'react';
import './Modal.css';  // 스타일 import

function Modal({ clickData, onClose }) {
  const [selectedColor, setSelectedColor] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);  // 2초 후 팝업 닫기
  };

  const handleSave = () => {
    console.log('저장된 데이터:', {
      location: clickData,
      color: selectedColor,
    });
    alert('즐겨찾기에 저장되었습니다!');
    onClose();  // 모달 닫기
  };

  return (
    <div className="modal-overlay">
      <div
        className={`modal-content ${selectedColor ? 'border-active' : ''}`}
        style={{ borderColor: selectedColor }}
      >
        <h2>위치 정보</h2>
        <p className="location-info"><strong>좌표:</strong> {clickData.lat}, {clickData.lng}</p>
        <p className="location-info"><strong>주소:</strong> {clickData.address}</p>

        <div className="color-selection">
          {['#ff7fbf', '#c9366e', '#007bff', '#36c991', '#a46ac8'].map((color) => (
            <button
              key={color}
              className={`color-button ${selectedColor === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>

        <div className="button-group">
          <button onClick={handleSave} className="save-button">저장</button>
          <button onClick={onClose} className="close-button">닫기</button>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          색상이 선택되었습니다!
        </div>
      )}
    </div>
  );
}

export default Modal;
