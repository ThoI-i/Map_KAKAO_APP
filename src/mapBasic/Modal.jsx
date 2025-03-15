import React from "react";
import "./Modal.css";

function Modal({ place, onClose }) {
  if (!place) return null; // place가 없으면 렌더링하지 않음

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{place.place_name}</h2>
        <p><strong>주소:</strong> {place.address_name}</p>
        <p><strong>연락처:</strong> {place.phone}</p>
        <p><strong>카테고리:</strong> {place.category_group_name}</p>
        <p><strong>클릭한 지점과 거리:</strong> {place.distance}m</p> {/* ✅ 거리 정보 추가 */}
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default Modal;
