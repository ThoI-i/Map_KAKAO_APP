import React from "react";
import "./Modal.css";

function Modal({ place, onClose }) {
  if (!place) return null; // place가 없으면 렌더링하지 않음

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{place.name}</h2>
        <p><strong>주소:</strong> {place.address}</p>
        <p><strong>카테고리:</strong> {place.category}</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default Modal;
