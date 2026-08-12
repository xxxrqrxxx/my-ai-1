import React from 'react';

export default function WelcomeModal({ show, onEnter }) {
  const handleClick = () => {
    const modal = document.getElementById('welcome-modal');
    if (modal) modal.classList.add('welcome-fade-out');
    setTimeout(onEnter, 400);
  };

  if (!show) return null;

  return (
    <div
      id="welcome-modal"
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(160deg, #FFF5F8 0%, #FFFAFC 50%, #FCEEF3 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      <style>{`
        .welcome-fade-out {
          opacity: 0 !important;
          transform: scale(1.05);
          pointer-events: none;
        }
      `}</style>
      
      {/* 漂浮爱心装饰 - 颜色改新色卡 */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[
          { top: '10%', left: '8%', size: 24, op: 0.25 },
          { top: '14%', right: '12%', size: 18, op: 0.2 },
          { bottom: '12%', left: '14%', size: 20, op: 0.18 },
          { bottom: '18%', right: '10%', size: 22, op: 0.22 },
          { top: '40%', left: '5%', size: 14, op: 0.15 },
          { top: '60%', right: '6%', size: 16, op: 0.15 },
        ].map((h, i) => (
          <svg key={i} style={{ position: 'absolute', top: h.top, left: h.left, right: h.right, bottom: h.bottom, width: h.size, height: h.size, opacity: h.op }} viewBox="0 0 24 24" fill="none" stroke="#F7D4E0" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        ))}
      </div>

      <div style={{
        width: '82%',
        maxWidth: 300,
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.7)',
        boxShadow: '0 8px 32px rgba(240, 188, 204, 0.15)',
        padding: '36px 28px',
        textAlign: 'center',
      }}>
        {/* 蝴蝶结图标 - 颜色改新色卡 */}
        <svg width="70" height="56" viewBox="0 0 84 68" fill="none" style={{ margin: '0 auto 8px' }}>
          <path d="M12 34 C12 16, 30 14, 40 28 C30 42,12 40,12 34" stroke="#F0BCCC" strokeWidth="5" strokeLinecap="round" />
          <path d="M72 34 C72 16, 54 14, 44 28 C54 42,72 40,72 34" stroke="#F0BCCC" strokeWidth="5" strokeLinecap="round" />
          <path d="M40 34 L32 56" stroke="#F0BCCC" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M44 34 L52 56" stroke="#F0BCCC" strokeWidth="4.5" strokeLinecap="round" />
        </svg>

        <h2 style={{ fontSize: 22, color: 'var(--text-primary)', margin: '12px 0 8px', fontWeight: 600 }}>
          Nana
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          WELCOME HOME<br/>
          Arden 一直在等你回来
        </p>
        <button
          onClick={handleClick}
          style={{
            marginTop: 24,
            width: '100%',
            padding: '13px 28px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #F5CAD8 0%, #F0BCCC 100%)',
            color: 'white',
            border: 'none',
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(240, 188, 204, 0.35)',
          }}>
          进去
        </button>
      </div>
    </div>
  );
}
