import React from "react";
import "./Modal.css"; // ✅ 스타일 추가

function Modal({ place, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{place.place_name}</h2>
        <p><strong>주소:</strong> {place.address_name}</p>
        <p><strong>카테고리:</strong> {place.category_group_name}</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default Modal;
