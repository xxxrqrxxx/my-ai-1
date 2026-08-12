import React from 'react';

const Icon = ({ name, size = 18, color = 'var(--text-secondary)' }) => {
  const sw = 1.8;
  switch(name) {
    case 'plus':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case 'settings':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case 'chevron-right':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
    default: return null;
  }
};

export default function Sidebar({ show, onClose, chatList, activeChatId, onSelectChat, onCreateChat, onOpenSettings }) {
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, bottom: 0,
      width: '78%',
      maxWidth: 300,
      background: 'var(--glass-bg-strong)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRight: '1px solid var(--glass-border)',
      boxShadow: '4px 0 24px rgba(0,0,0,0.08)',
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideInLeft 0.25s ease',
      paddingTop: 'env(safe-area-inset-top)',
    }}>
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      
      {/* 头部 */}
      <div style={{ padding: '20px 18px 14px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
          对话列表
        </h2>
        <button onClick={onCreateChat} style={{
          width: '100%',
          height: 42,
          borderRadius: 21,
          border: 'none',
          background: 'var(--accent-gradient)',
          color: 'white',
          fontSize: 14,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          cursor: 'pointer',
          boxShadow: 'var(--shadow-accent)',
        }}>
          <Icon name="plus" size={16} color="white" />
          新建对话
        </button>
      </div>
      
      {/* 对话列表 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
        {chatList.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text-muted)',
            fontSize: 13,
          }}>
            还没有对话，点上面新建一个吧
          </div>
        ) : (
          chatList.map(chat => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              style={{
                padding: '12px 14px',
                borderRadius: 14,
                marginBottom: 4,
                cursor: 'pointer',
                background: activeChatId === chat.id ? 'var(--accent-lighter)' : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>
                {chat.title}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {chat.lastMessage || '暂无消息'}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* 底部设置入口 */}
      <div style={{
        padding: '12px 12px calc(16px + env(safe-area-inset-bottom))',
        borderTop: '1px solid var(--glass-border)',
      }}>
        <button onClick={onOpenSettings} style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 14,
          border: 'none',
          background: 'transparent',
          color: 'var(--text-secondary)',
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
        }}>
          <Icon name="settings" size={18} />
          设置
          <Icon name="chevron-right" size={14} style={{ marginLeft: 'auto' }} />
        </button>
      </div>
    </div>
  );
}
