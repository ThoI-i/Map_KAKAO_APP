import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';  // ? Redux 관련 추가
import { setMarkerColor, setMarkerIcon } from '../store/markerSlice'; // ? Redux 액션 불러오기
import './Modal.css';

function Modal({ place, onClose }) {
  if (!place) return null;

  const dispatch = useDispatch(); // ? Redux Dispatch 추가
  const selectedColor = useSelector((state) => state.marker.color); // ? Redux에서 색상 가져오기
  const selectedIcon = useSelector((state) => state.marker.icon);   // ? Redux에서 아이콘 가져오기

  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [iconMenuOpen, setIconMenuOpen] = useState(false);
  const colorMenuRef = useRef(null);
  const iconMenuRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
      if (
        colorMenuRef.current &&
        !colorMenuRef.current.contains(event.target) &&
        !event.target.classList.contains('color-menu-trigger')
      ) {
        setColorMenuOpen(false);
      }
      if (
        iconMenuRef.current &&
        !iconMenuRef.current.contains(event.target) &&
        !event.target.classList.contains('icon-menu-trigger')
      ) {
        setIconMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-result-display" style={{ position: 'absolute', top: '10px', left: '-60px', backgroundColor: selectedColor }}>
        {selectedIcon}
      </div>
  
      <div className="modal-content" ref={modalRef} style={{ borderColor: selectedColor }}>
        <div className="modal-header">
          <div 
            className="color-menu-container"
            onMouseEnter={() => !iconMenuOpen && setColorMenuOpen(true)}
            onMouseLeave={() => setColorMenuOpen(false)}
            ref={colorMenuRef}
          >
            <div 
              className={`color-menu-trigger ${iconMenuOpen ? 'disabled' : ''}`} 
              style={{ backgroundColor: selectedColor }}
            ></div>
            {colorMenuOpen && (
              <div className="color-menu">
                {['#ff7fbf', '#c9366e', '#007bff', '#36c991', '#a46ac8'].map((color) => (
                  <div 
                    key={color} 
                    className="color-option" 
                    style={{ backgroundColor: color }} 
                    onClick={() => dispatch(setMarkerColor(color))} // ? Redux 상태 업데이트
                  />
                ))}
              </div>
            )}
          </div>
          <div 
            className="icon-menu-container"
            onMouseEnter={() => !colorMenuOpen && setIconMenuOpen(true)}
            onMouseLeave={() => setIconMenuOpen(false)}
            ref={iconMenuRef}
          >
            <div className={`icon-menu-trigger ${colorMenuOpen ? 'disabled' : ''}`}>
              {selectedIcon}
            </div>
            {iconMenuOpen && (
              <div className="icon-menu">
                {['★', '●', '◆', '■', '▲', '▼', '♥', '♬'].map((icon) => (
                  <div 
                    key={icon} 
                    className="icon-option" 
                    onClick={() => dispatch(setMarkerIcon(icon))} // ? Redux 상태 업데이트
                  >
                    {icon}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ? 로딩 중 메시지 추가 */}
        {!place.place_name ? (
          <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>?? 데이터 불러오는 중...</p>
        ) : (
          <>
            <h2>{place.place_name}</h2>
            <p><strong>주소:</strong> {place.address_name}</p>
            <p><strong>연락처:</strong> {place.phone || '-'}</p>
            <p><strong>카테고리:</strong> {place.category_group_name || '-'}</p>
            <p><strong>클릭한 지점과 거리:</strong> {place.distance ? `${place.distance}m` : '-'}</p>
          </>
        )}
        
        <div className="button-row">
          <button onClick={onClose}>저장</button>
          <button onClick={onClose}>닫기</button>
          <div className="modal-result-display" style={{ backgroundColor: selectedColor, bottom: '10px', right: '10px'}}>
            {selectedIcon}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
