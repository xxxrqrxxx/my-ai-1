import React, { useState } from 'react';
import SettingsDetailView from './SettingsDetailView';

function ChevronLeftIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SettingsView({ onBack, onOpenMemory }) {
  const [isExiting, setIsExiting] = useState(false);
  // 内部子页面状态：main=设置首页，detail=通用设置详情
  const [innerPage, setInnerPage] = useState('main');

  const handleBack = () => {
    // 如果当前在详情页，先切回设置首页，不退出设置
    if (innerPage === 'detail') {
      setInnerPage('main');
      return;
    }
    // 在设置首页，才退出到聊天页
    setIsExiting(true);
    setTimeout(() => {
      onBack();
    }, 280);
  };

  // 如果内部要显示通用设置详情，包裹满高容器保证子页面正常渲染
  if (innerPage === 'detail') {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <SettingsDetailView onBack={handleBack} />
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#FBF2F1',
        animation: isExiting ? 'slideOutRight 0.28s ease-in forwards' : 'slideInRight 0.32s ease-out',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* 头部返回栏 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 20px',
          flexShrink: 0,
          background: 'transparent',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <button
          onClick={handleBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFFDFB',
            color: '#8C5468',
            border: '1px solid #F0D2DC',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(140,84,104,0.08)',
            opacity: 1,
            visibility: 'visible',
            position: 'relative',
            zIndex: 20,
          }}
        >
          <ChevronLeftIcon style={{ width: 18, height: 18, display: 'block', visibility: 'visible', opacity: 1 }} />
        </button>
        <h1
          style={{
            margin: 0,
            marginLeft: 12,
            fontSize: 22,
            fontWeight: 700,
            color: '#4A3B3F',
          }}
        >
          设置
        </h1>
      </div>

      {/* 主体滚动区域 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 20px 32px 20px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        {/* 标题说明 */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#4A3B3F', margin: '0 0 6px 0' }}>
            偏好设置
          </h2>
          <p style={{ fontSize: 14, color: '#B98A96', margin: 0 }}>
            管理记忆片段、模型参数与个性化选项
          </p>
        </div>

        {/* 设置项容器 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* 记忆 按钮：调用父传进来的 onOpenMemory，跳记忆库页面 */}
          <button
            onClick={onOpenMemory}
            style={{
              width: '100%',
              textAlign: 'left',
              borderRadius: 16,
              padding: '14px 16px',
              background: '#FFFDFB',
              border: 'none',
              boxShadow: '0 2px 8px rgba(140,84,104,0.08)',
              cursor: 'pointer',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#4A3B3F', marginBottom: 2 }}>
                  记忆
                </div>
                <div style={{ fontSize: 12, color: '#B98A96' }}>
                  查看所有记忆片段
                </div>
              </div>
              <div style={{ width: 18, height: 18 }} />
            </div>
          </button>

          {/* 通用设置：切换内部页面，不通知父组件 */}
          <button
            onClick={() => setInnerPage('detail')}
            style={{
              width: '100%',
              textAlign: 'left',
              borderRadius: 16,
              padding: '14px 16px',
              background: '#FFFDFB',
              border: 'none',
              boxShadow: '0 2px 8px rgba(140,84,104,0.08)',
              cursor: 'pointer',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#4A3B3F', marginBottom: 2 }}>
                  通用设置
                </div>
                <div style={{ fontSize: 12, color: '#B98A96' }}>
                  模型 / 提示词 / 偏好
                </div>
              </div>
              <div style={{ width: 18, height: 18 }} />
            </div>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }

        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        *::-webkit-scrollbar {
          display: none !important;
        }
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        .big-chevron-right,
        .large-arrow,
        .chevron-right-large {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none;
        }
        svg path[d*="M9 18l6-6-6-6"] {
          stroke: currentColor;
          stroke-width: 2;
        }
      `}</style>
    </div>
  );
}