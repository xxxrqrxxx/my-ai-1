import React, { useState, useEffect } from 'react';
import './theme.css';
import BottomNav from './components/BottomNav';
import FloatingHearts from './components/FloatingHearts';
import HomeView from './components/HomeView';
import ChatView from './components/ChatView';
import MemoryView from './components/MemoryView';
import DiaryView from './components/DiaryView';
import McpView from './components/McpView';
import SettingsView from './components/SettingsView';
import Sidebar from './components/Sidebar';
import WelcomeModal from './components/WelcomeModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState('chat');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const aiName = 'Arden';
  const userName = 'Nana';

  // 检测键盘弹起
  useEffect(() => {
    if (!window.visualViewport) return;
    const handleResize = () => {
      const heightDiff = window.innerHeight - window.visualViewport.height;
      setKeyboardOpen(heightDiff > 100);
    };
    window.visualViewport.addEventListener('resize', handleResize);
    return () => window.visualViewport.removeEventListener('resize', handleResize);
  }, []);

  // 设置浏览器主题色
  useEffect(() => {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = '#FFF5F8';
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView userName={userName} onOpenChat={() => setCurrentPage('chat')} onOpenDiary={(date) => { setCurrentPage('diary'); }} />;
      case 'chat':
        // 删掉了onOpenMemory和onOpenUsage
        return <ChatView aiName={aiName} userName={userName} onOpenSidebar={() => setShowSidebar(true)} />;
      case 'memory':
        return <MemoryView />;
      case 'diary':
        return <DiaryView />;
      case 'mcp':
        return <McpView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <ChatView aiName={aiName} userName={userName} onOpenSidebar={() => setShowSidebar(true)} />;
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      overflow: 'hidden', 
      position: 'relative',
      background: 'linear-gradient(160deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%)',
    }}>
      <FloatingHearts />
      {renderPage()}
      
      {!keyboardOpen && (
        <BottomNav activeTab={currentPage} onTabChange={setCurrentPage} />
      )}

      {showSidebar && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <div onClick={() => setShowSidebar(false)} style={{
            position: 'absolute', inset: 0,
            background: 'rgba(60, 40, 55, 0.3)',
            backdropFilter: 'blur(6px)',
          }} />
          <Sidebar
            show={showSidebar}
            onClose={() => setShowSidebar(false)}
            chatList={[]}
            activeChatId={null}
            onSelectChat={() => setShowSidebar(false)}
            onCreateChat={() => setShowSidebar(false)}
            onOpenSettings={() => { setShowSidebar(false); setCurrentPage('settings'); }}
          />
        </div>
      )}

      <WelcomeModal show={showWelcome} onEnter={() => setShowWelcome(false)} />
    </div>
  );
}
