// ✅ 공용 틀 유지용: components/modal/Modal.jsx
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

const Modal = ({ visible, onClose, children }) => {
  if (!visible) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body, // ✅ Portal로 이동
    console.log("🟣 [Modal] visible:", visible, "children:", children)
  );
};

export default Modal;
