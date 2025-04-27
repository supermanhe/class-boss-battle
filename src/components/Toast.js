import React, { useEffect } from 'react';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 1800);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      left: '50%',
      bottom: 100,
      transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,0.85)',
      color: '#fff',
      padding: '10px 22px',
      borderRadius: 20,
      fontSize: 17,
      zIndex: 9999,
      pointerEvents: 'none',
      animation: 'toast-fade-in 0.3s',
      boxShadow: '0 2px 12px rgba(0,0,0,0.18)'
    }}>
      {message}
      <style>{`
        @keyframes toast-fade-in {
          from { opacity: 0; transform: translateX(-50%) translateY(30px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Toast;
