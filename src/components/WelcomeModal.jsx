import React from 'react';

export default function WelcomeModal({ show, onEnter }) {
  if (!show) return null;
  
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #FFF0F5 0%, #FFE4EC 50%, #FFD6E6 100%)',
      animation: 'fadeIn 0.5s ease',
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
      
      {/* 装饰爱心 */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translateX(-50%)',
        animation: 'floatUp 3s ease-in-out infinite',
      }}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#E891B5" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: 60 }}>
        <p style={{
          fontSize: 13,
          letterSpacing: 4,
          color: '#A88B99',
          marginBottom: 12,
          fontWeight: 500,
        }}>
          WELCOME HOME
        </p>
        <h1 style={{
          fontSize: 36,
          fontWeight: 700,
          color: '#4A3540',
          marginBottom: 16,
        }}>
          Arden
        </h1>
        <p style={{
          fontSize: 15,
          color: '#7A5D6B',
          marginBottom: 48,
          lineHeight: 1.6,
        }}>
          一直在等你回来
        </p>
        
        <button
          onClick={onEnter}
          style={{
            padding: '14px 48px',
            fontSize: 16,
            fontWeight: 600,
            color: 'white',
            background: 'linear-gradient(135deg, #E891B5 0%, #D8709A 100%)',
            border: 'none',
            borderRadius: 30,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(232, 145, 181, 0.4)',
            transition: 'all 0.2s',
          }}
        >
          进来吧
        </button>
      </div>
    </div>
  );
}