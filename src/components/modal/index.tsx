import { useState } from 'react';
import './index.scss';

interface ModalProps {
  children: React.ReactNode;
  close: () => void;
  className?: string;
}

function Modal({children, close, className}: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const modalHandler = () => {
    setIsClosing(true);
    setTimeout(() => {
      close();
    }, 300)
  }

  return (
    <>
      <div className={`modal-backdrop ${isClosing ? 'closing' : ''}`} onClick={modalHandler} />
      <div className={`fade-box ${className} ${isClosing ? 'closing' : ''}`} />
      <div className={`modal ${className} ${isClosing ? 'closing' : ''}`}>
        {children}
      </div>
    </>
  );
}

export default Modal;