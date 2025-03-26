import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';  
import { setMarkerColor, setMarkerIcon } from '../store/markerSlice'; 
import styles from "./Modal.module.css";  

function Modal({ place, onClose }) {
  if (!place) return null;

  const dispatch = useDispatch(); 
  const selectedColor = useSelector((state) => state.marker.color);
  const selectedIcon = useSelector((state) => state.marker.icon);

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
        !event.target.classList.contains(styles.colorMenuTrigger)
      ) {
        setColorMenuOpen(false);
      }
      if (
        iconMenuRef.current &&
        !iconMenuRef.current.contains(event.target) &&
        !event.target.classList.contains(styles.iconMenuTrigger)
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
    <div className={styles.modalOverlay}>
      <div className={styles.modalResultDisplay} style={{ position: 'absolute', top: '10px', left: '-60px', backgroundColor: selectedColor }}>
        {selectedIcon}
      </div>
  
      <div className={styles.modalContent} ref={modalRef} style={{ borderColor: selectedColor }}>
        <div className={styles.modalHeader}>
          <div 
            className={styles.colorMenuContainer}
            onMouseEnter={() => !iconMenuOpen && setColorMenuOpen(true)}
            onMouseLeave={() => setColorMenuOpen(false)}
            ref={colorMenuRef}
          >
            <div 
              className={`${styles.colorMenuTrigger} ${iconMenuOpen ? styles.disabled : ''}`} 
              style={{ backgroundColor: selectedColor }}
            ></div>
            {colorMenuOpen && (
              <div className={styles.colorMenu}>
                {['#ff7fbf', '#c9366e', '#007bff', '#36c991', '#a46ac8'].map((color) => (
                  <div 
                    key={color} 
                    className={styles.colorOption} 
                    style={{ backgroundColor: color }} 
                    onClick={() => dispatch(setMarkerColor(color))}
                  />
                ))}
              </div>
            )}
          </div>
          <div 
            className={styles.iconMenuContainer}
            onMouseEnter={() => !colorMenuOpen && setIconMenuOpen(true)}
            onMouseLeave={() => setIconMenuOpen(false)}
            ref={iconMenuRef}
          >
            <div className={`${styles.iconMenuTrigger} ${colorMenuOpen ? styles.disabled : ''}`}>
              {selectedIcon}
            </div>
            {iconMenuOpen && (
              <div className={styles.iconMenu}>
                {['★', '●', '◆', '■', '▲', '▼', '♥', '♬'].map((icon) => (
                  <div 
                    key={icon} 
                    className={styles.iconOption} 
                    onClick={() => dispatch(setMarkerIcon(icon))}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {!place.place_name ? (
          <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>📡 데이터 불러오는 중...</p>
        ) : (
          <>
            <h2>{place.place_name}</h2>
            <p><strong>주소:</strong> {place.address_name}</p>
            <p><strong>연락처:</strong> {place.phone || '-'}</p>
            <p><strong>카테고리:</strong> {place.category_group_name || '-'}</p>
            <p><strong>클릭한 지점과 거리:</strong> {place.distance ? `${place.distance}m` : '-'}</p>
          </>
        )}
        
        <div className={styles.buttonRow}>
          <button onClick={onClose}>저장</button>
          <button onClick={onClose}>닫기</button>
          <div className={styles.modalResultDisplay} style={{ backgroundColor: selectedColor, bottom: '10px', right: '10px'}}>
            {selectedIcon}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
