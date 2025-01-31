import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div style={overlayStyle}>
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 bg-transparent border-white border-t-transparent border-solid rounded-full" role="status">
            </div>
        </div>
    );
};

const overlayStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 49,
};
export default LoadingSpinner;
