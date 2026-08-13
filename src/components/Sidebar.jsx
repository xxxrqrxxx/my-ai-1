import React from 'react';

const Icon = ({ name, size = 18, color = 'var(--text-secondary)' }) => {
  const sw = 1.8;
  switch(name) {
    case 'plus':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case 'trash':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
    default: return null;
  }
};

export default function Sidebar({ show, onClose, chatList, activeChatId, onSelectChat, onCreateChat, onDeleteChat }) {
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
      
      {/* 对话列表 - 立体卡片式 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 16px' }}>
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
                position: 'relative',
                padding: '14px 40px 14px 16px',
                borderRadius: 16,
                marginBottom: 10,
                cursor: 'pointer',
                background: activeChatId === chat.id ? 'var(--accent-lighter)' : 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${activeChatId === chat.id ? 'var(--accent)' : 'var(--glass-border)'}`,
                boxShadow: activeChatId === chat.id ? 'var(--shadow-accent)' : 'var(--shadow)',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {chat.title}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {chat.lastMessage || '暂无消息'}
              </div>
              {onDeleteChat && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    border: 'none',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    opacity: 0.6,
                  }}
                >
                  <Icon name="trash" size={15} color="var(--text-muted)" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
