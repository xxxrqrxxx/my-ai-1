import React from 'react';
// 修复：createPortal 从 react-dom 引入
import { createPortal } from 'react-dom';

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

  const dom = createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '72vw',
      maxWidth: 320,
      height: '100vh',
      backgroundColor: '#FFF3F7',
      zIndex: 200,
      boxShadow: '2px 0 12px rgba(140, 84, 104, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideInLeft 0.24s ease-out'
    }}>
      <div style={{padding:'20px 16px', flex:'1', overflowY:'auto'}}>
        <h2 style={{fontSize:22, color:'#7B4B70', marginTop:0, marginBottom:20}}>对话列表</h2>

        <button
          onClick={onCreateChat}
          style={{
            width:'100%',
            padding:'12px 14px',
            borderRadius:14,
            border:'1px solid #F0D2DC',
            backgroundColor:'#FFFFFF',
            fontSize:16,
            color:'#8C5468',
            cursor:'pointer',
            textAlign:'left',
            marginBottom:16
          }}
        >
          + 新建对话
        </button>

        {chatList.length === 0 ? (
          <div style={{color:'#B98A96', textAlign:'center', padding:'24px 0'}}>暂无对话</div>
        ) : (
          <>
            {chatList.map(item=>(
              <div
                key={item.id}
                onClick={()=>onSelectChat(item.id)}
                style={{
                  padding:'12px 14px',
                  borderRadius:14,
                  backgroundColor: activeChatId === item.id ? '#F7DCE3':'transparent',
                  cursor:'pointer',
                  marginBottom:8
                }}
              >
                <div style={{fontSize:16, color:'#4A3B3F'}}>{item.title}</div>
                <div style={{fontSize:12, color:'#B98A96', marginTop:4}}>{item.time}</div>
              </div>
            ))}
          </>
        )}
      </div>

      <div style={{padding:'12px 16px', flexShrink:0}}>
        <button
          onClick={onOpenSettings}
          style={{
            width:'100%',
            padding:'12px 14px',
            borderRadius:14,
            border:'1px solid #F0D2DC',
            backgroundColor:'#FFFFFF',
            fontSize:16,
            color:'#8C5468',
            cursor:'pointer',
            textAlign:'left'
          }}
        >
          ⚙️ 设置
        </button>
      </div>
    </div>,
    document.body
  )

  return dom;
}