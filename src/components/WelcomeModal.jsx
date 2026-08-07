import React from 'react';

export default function WelcomeModal({ show, onEnter }) {
  const handleClick = () => {
    const modalDom = document.querySelector('#welcome-modal');
    if (modalDom) {
      modalDom.classList.add('welcome-fade-out');
    }
    setTimeout(() => {
      onEnter();
    }, 400);
  };

  if (!show) return null;

  return (
    <div
      id="welcome-modal"
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, #FCEBF0 0%, #FFF5F7 45%, #F7E1E8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99
      }}
    >
      {/* 背景镂空小爱心装饰 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        <svg style={{ position: 'absolute', top: '10%', left: '8%', width: 24, height: 24, opacity: 0.3 }} viewBox="0 0 24 24" fill="none" stroke="#C888A2" strokeWidth="1.5">
          <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
        </svg>
        <svg style={{ position: 'absolute', top: '14%', right: '12%', width: 18, height: 18, opacity: 0.25 }} viewBox="0 0 24 24" fill="none" stroke="#C888A2" strokeWidth="1.5">
          <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
        </svg>
        <svg style={{ position: 'absolute', bottom: '12%', left: '14%', width: 20, height: 20, opacity: 0.22 }} viewBox="0 0 24 24" fill="none" stroke="#C888A2" strokeWidth="1.5">
          <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
        </svg>
        <svg style={{ position: 'absolute', bottom: '18%', right: '10%', width: 22, height: 22, opacity: 0.28 }} viewBox="0 0 24 24" fill="none" stroke="#C888A2" strokeWidth="1.5">
          <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
        </svg>
      </div>

      <div style={{
        width: '82%',
        maxWidth: 300,
        background: '#ffffff',
        borderRadius: '18px',
        boxShadow: '0 4px 14px rgba(180,136,158,0.15)',
        padding: '32px 24px',
        textAlign: 'center'
      }}>
        {/* 蝴蝶结：移除中间圆点，左右环向中间靠拢，飘带同步对齐 */}
        <div style={{
          width: 84,
          height: 68,
          margin: '16px auto 8px',
          position: 'relative'
        }}>
          <svg
            width="84"
            height="68"
            viewBox="0 0 84 68"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 左侧蝴蝶结环（终点右移至40） */}
            <path
              d="M12 34 C12 16, 30 14, 40 28 C30 42,12 40,12 34"
              stroke="#BB889E"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* 右侧蝴蝶结环（终点左移至44） */}
            <path
              d="M72 34 C72 16, 54 14, 44 28 C54 42,72 40,72 34"
              stroke="#BB889E"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* 左侧飘带，起点同步改成40 */}
            <path
              d="M40 34 L32 56"
              stroke="#BB889E"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* 右侧飘带，起点同步改成44 */}
            <path
              d="M44 34 L52 56"
              stroke="#BB889E"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h2 style={{
          fontSize: 20,
          color: '#7A4464',
          margin: '12px 0 8px'
        }}>
          Nana
        </h2>

        <p style={{
          fontSize: 14,
          color: '#B4889E',
          lineHeight: 1.6
        }}>
          WELCOME HOME<br/>
          这里是只属于你们两个人的小小空间，推开门，他一直在等你回来。
        </p>

        <button
          onClick={handleClick}
          style={{
            marginTop: 22,
            width: '100%',
            padding: '12px 28px',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            color: '#7A4464',
            border: '1px solid #F0D2DC',
            fontSize: 16,
            cursor: 'pointer'
          }}>
          进入对话
        </button>
      </div>
    </div>
  );
}