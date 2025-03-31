// ✅ 도메인 전용 내용 분리: features/poi/components/POIDetailContent.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMarkerColor, setMarkerIcon } from '@/store/markerSlice';

const POIDetailContent = ({ place, onClose }) => {
  const dispatch = useDispatch();
  const selectedColor = useSelector((state) => state.marker.color);
  const selectedIcon = useSelector((state) => state.marker.icon);

  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [iconMenuOpen, setIconMenuOpen] = useState(false);
  const colorMenuRef = useRef(null);
  const iconMenuRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
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

  if (!place) return null;

  return (
    <div className={styles.modalDetailWrapper} ref={contentRef} style={{ borderColor: selectedColor }}>
      <div className={styles.modalResultDisplay} style={{ position: 'absolute', top: '10px', left: '-60px', backgroundColor: selectedColor }}>
        {selectedIcon}
      </div>

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
              {["#ff7fbf", "#c9366e", "#007bff", "#36c991", "#a46ac8"].map((color) => (
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
              {["★", "●", "◆", "■", "▲", "▼", "♥", "♬"].map((icon) => (
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

      <div className={styles.modalBody}>
        <h2>{place.place_name}</h2>
        <p><strong>주소:</strong> {place.address_name}</p>
        <p><strong>연락처:</strong> {place.phone || '-'}</p>
        <p><strong>카테고리:</strong> {place.category_group_name || '-'}</p>
        <p><strong>클릭한 지점과 거리:</strong> {place.distance ? `${place.distance}m` : '-'}</p>
      </div>

      <div className={styles.buttonRow}>
        <button onClick={onClose}>저장</button>
        <button onClick={onClose}>닫기</button>
        <div className={styles.modalResultDisplay} style={{ backgroundColor: selectedColor, bottom: '10px', right: '10px' }}>
          {selectedIcon}
        </div>
      </div>
    </div>
  );
};

export default POIDetailContent;
