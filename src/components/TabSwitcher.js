import React from 'react';

const TabSwitcher = ({ activeTab, onTabChange }) => {
  return (
    <div style={{
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: '100%',
      background: 'rgba(255,255,255,0.98)',
      boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0.5rem 0',
      zIndex: 100,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18
    }}>
      <button
        onClick={() => onTabChange('damage')}
        style={{
          background: activeTab === 'damage' ? 'rgba(255, 224, 130, 0.35)' : 'none',
          border: 'none',
          outline: 'none',
          margin: '0 38px',
          borderRadius: 16,
          boxShadow: activeTab === 'damage' ? '0 2px 8px rgba(255,112,67,0.10)' : 'none',
          opacity: activeTab === 'damage' ? 1 : 0.6,
          transform: activeTab === 'damage' ? 'scale(1.18)' : 'scale(1)',
          transition: 'all 0.2s',
          cursor: 'pointer',
          padding: 6
        }}
        title="伤害榜"
      >
        <img src="https://img.icons8.com/color/96/000000/trophy.png" alt="榜" style={{ width: 48, height: 48 }} />
      </button>
      <button
        onClick={() => onTabChange('input')}
        style={{
          background: activeTab === 'input' ? 'rgba(129, 212, 250, 0.32)' : 'none',
          border: 'none',
          outline: 'none',
          margin: '0 38px',
          borderRadius: 16,
          boxShadow: activeTab === 'input' ? '0 2px 8px rgba(66,165,245,0.10)' : 'none',
          opacity: activeTab === 'input' ? 1 : 0.6,
          transform: activeTab === 'input' ? 'scale(1.18)' : 'scale(1)',
          transition: 'all 0.2s',
          cursor: 'pointer',
          padding: 6
        }}
        title="录入成绩"
      >
        <img src="https://img.icons8.com/color/96/000000/pencil--v1.png" alt="录入" style={{ width: 48, height: 48 }} />
      </button>
    </div>
  );
};

export default TabSwitcher;
