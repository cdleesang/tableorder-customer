import './index.scss';

interface ModalProps {
  children: React.ReactNode;
  close: () => void;
  className?: string;
}

function Modal({children, close, className}: ModalProps) {
  return (
    <>
      <div className='modal-backdrop' onClick={close} />
      <div className={`modal ${className}`}>
        {children}
      </div>
    </>
  );
}

export default Modal;