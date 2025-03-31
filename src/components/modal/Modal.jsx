// ✅ 공용 Portal 기반 Modal - Redux와 독립
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

const Modal = ({ visible, onClose, children }) => {
  if (!visible) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()} // 클릭 버블링 방지
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
