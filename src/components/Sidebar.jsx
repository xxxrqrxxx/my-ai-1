import React from 'react';
import { createPortal } from 'react-dom';

const Icon = ({ name, size = 20, color = 'var(--text-secondary)' }) => {
  const sw = 1.8;
  switch(name) {
    case 'new':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case 'settings':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24"/>
      </svg>;
    case 'close':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    case 'chat':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    default: return null;
  }
};

export default function Sidebar({
  show,
  onClose,
  chatList,
  activeChatId,
  onSelectChat,
  onCreateChat,
  onOpenSettings
}) {
  if (!show) return null;

  return createPortal(
    <>
      {/* 遮罩 */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(60, 40, 55, 0.3)',
          backdropFilter: 'blur(4px)',
          zIndex: 199,
          animation: 'fadeIn 0.2s ease',
        }}
      />
      {/* 侧边栏主体 */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '78vw',
        maxWidth: 300,
        height: '100vh',
        background: 'var(--bg-card-solid)',
        backdropFilter: 'blur(40px) saturate(1.8)',
        zIndex: 200,
        boxShadow: '4px 0 30px var(--shadow-strong)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInLeft 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* 顶部 */}
        <div style={{
          padding: 'calc(env(safe-area-inset-top) + 16px) 16px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            对话
          </h2>
          <button onClick={onClose} className="jelly-button" style={{ width: 36, height: 36 }}>
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* 新对话按钮 */}
        <div style={{ padding: '0 16px 16px' }}>
          <button
            onClick={onCreateChat}
            className="jelly-button jelly-button-accent"
            style={{
              width: '100%', height: 46, borderRadius: 23,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontSize: 15, fontWeight: 500,
            }}
          >
            <Icon name="new" size={18} color="white" />
            新建对话
          </button>
        </div>

        {/* 对话列表 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
          {chatList.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '40px 20px',
              color: 'var(--text-muted)', fontSize: 14,
            }}>
              还没有对话哦
            </div>
          ) : (
            chatList.map(item => (
              <div
                key={item.id}
                onClick={() => { onSelectChat(item.id); onClose(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 12px',
                  borderRadius: 14,
                  background: activeChatId === item.id ? 'var(--bg-accent-light)' : 'transparent',
                  cursor: 'pointer',
                  marginBottom: 4,
                  transition: 'background 0.15s',
                }}
              >
                <Icon name="chat" size={16} color={activeChatId === item.id ? 'var(--bg-accent)' : 'var(--text-muted)'} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 500,
                    color: activeChatId === item.id ? 'var(--bg-accent)' : 'var(--text-primary)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {item.time}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 底部设置 */}
        <div style={{ padding: '12px 16px calc(16px + var(--safe-bottom))' }}>
          <button
            onClick={() => { onOpenSettings(); onClose(); }}
            className="jelly-card"
            style={{
              width: '100%', height: 50, borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontSize: 15, color: 'var(--text-secondary)',
              border: 'none', cursor: 'pointer',
            }}
          >
            <Icon name="settings" size={18} />
            设置
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>,
    document.body
  );
}