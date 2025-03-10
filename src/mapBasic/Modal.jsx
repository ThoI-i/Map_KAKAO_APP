import React, { useEffect, useRef } from "react";
import "./Modal.css";

function Modal({ place, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2>{place.name}</h2>
        <p><strong>주소:</strong> {place.address}</p>
        <button onClick={onClose} className="close-button">닫기</button>
      </div>
    </div>
  );
}

export default Modal;
