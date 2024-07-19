import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="relative bg-white rounded-lg p-4 w-[80vw] h-[80vh] flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
        >
          &times;
        </button>
        <div className="w-3/4 h-3/4 flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
