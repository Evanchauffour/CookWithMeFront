
import React, { ReactNode } from 'react';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <button style={closeButtonStyle} onClick={onClose}>
                    ×
                </button>
                {children}
            </div>
        </div>
    );
};

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '90%',
    maxHeight: '90%',
    overflowY: 'auto',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    position: 'relative',
};

const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    border: 'none',
    background: 'none',
    fontSize: '20px',
    cursor: 'pointer',
};

export default Modal;
