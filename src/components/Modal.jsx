import React, { useState } from 'react';
import './Modal.css';

function Modal({ clickData, onClose, onSave, onColorChange }) {
  const [selectedColor, setSelectedColor] = useState(clickData.color || '#36c991');

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    onColorChange(color); // ✅ 색상 변경 핸들러 호출 (즉시 반영)
  };

  const handleSave = () => {
    onSave(selectedColor);
    alert('즐겨찾기에 저장되었습니다!');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ borderColor: selectedColor }}>
        <h2>위치 정보</h2>
        <p><strong>좌표:</strong> {clickData.lat}, {clickData.lng}</p>
        <p><strong>주소:</strong> {clickData.address || '주소 정보를 불러올 수 없습니다.'}</p>

        <div className="color-selection">
          {['#ff7fbf', '#c9366e', '#007bff', '#36c991', '#a46ac8'].map((color) => (
            <button
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
              className={`color-button ${selectedColor === color ? 'active' : ''}`}
            />
          ))}
        </div>

        <div className="button-group">
          <button onClick={handleSave} className="save-button">저장</button>
          <button onClick={onClose} className="close-button">닫기</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
