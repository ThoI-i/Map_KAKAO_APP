import React, { useEffect, useRef, useState } from 'react';
import './Modal.css';

function Modal({ clickData, onClose, onSave, onColorChange, onIconChange }) {
  const [selectedColor, setSelectedColor] = useState(clickData.color || '#36c991');
  const [selectedIcon, setSelectedIcon] = useState(clickData.icon || '★'); // ✅ 기본 아이콘도 설정
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  const handleIconSelect = (icon) => {
    setSelectedIcon(icon);
    onIconChange(icon); // ✅ 아이콘 변경 핸들러 추가
  };

  const handleSave = () => {
    onSave(selectedColor, selectedIcon); // ✅ 선택한 색상과 아이콘을 저장
    alert('즐겨찾기에 저장되었습니다!');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef} style={{ borderColor: selectedColor }}>
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

        <div className="icon-selection">
          {['★', '●', '◆', '■', '▲', '▼', '♥', '♬'].map((icon) => (
            <button
              key={icon}
              className={`icon-button ${selectedIcon === icon ? 'active' : ''}`}
              style={{ backgroundColor: selectedColor, color: 'white' }}
              onClick={() => handleIconSelect(icon)}
            >
              {icon}
            </button>
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
