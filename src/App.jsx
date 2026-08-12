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
import { getSessions, createSession, getSettings } from './api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('chat');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const aiName = 'Arden';
  const userName = 'Nana';

  // 全局状态
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化加载
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      // 加载设置
      const s = await getSettings();
      setSettings(s);

      // 加载会话列表
      const list = await getSessions();
      setSessions(list);

      // 如果没有会话，创建一个
      if (!list || list.length === 0) {
        const newSession = await createSession('新对话');
        setSessions([newSession]);
        setCurrentSessionId(newSession.id);
      } else {
        setCurrentSessionId(list[0].id);
      }
    } catch (err) {
      console.error('初始化失败:', err);
      // 失败时用本地默认
      setSettings({
        model: 'gemini-2.0-flash',
        system_prompt: '你是 Arden，Nana 的温柔伴侣。',
        temperature: 0.8,
        max_tokens: 2000,
        top_p: 0.9,
      });
    } finally {
      setLoading(false);
    }
  };

  // 创建新会话
  const handleCreateSession = async () => {
    try {
      const newSession = await createSession('新对话');
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setShowSidebar(false);
      setCurrentPage('chat');
    } catch (err) {
      console.error('创建会话失败:', err);
    }
  };

  // 切换会话
  const handleSelectSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    setShowSidebar(false);
  };

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
    if (loading) {
      return (
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: '100%', color: 'var(--text-muted)', fontSize: 14,
        }}>
          加载中...
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomeView userName={userName} onOpenChat={() => setCurrentPage('chat')} onOpenDiary={(date) => { setCurrentPage('diary'); }} />;
      case 'chat':
        return (
          <ChatView
            aiName={aiName}
            userName={userName}
            onOpenSidebar={() => setShowSidebar(true)}
            sessionId={currentSessionId}
            settings={settings}
            onUpdateSettings={setSettings}
          />
        );
      case 'memory':
        return <MemoryView />;
      case 'diary':
        return <DiaryView />;
      case 'mcp':
        return <McpView />;
      case 'settings':
        return <SettingsView settings={settings} onUpdateSettings={setSettings} />;
      default:
        return (
          <ChatView
            aiName={aiName}
            userName={userName}
            onOpenSidebar={() => setShowSidebar(true)}
            sessionId={currentSessionId}
            settings={settings}
            onUpdateSettings={setSettings}
          />
        );
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
            chatList={sessions}
            activeChatId={currentSessionId}
            onSelectChat={handleSelectSession}
            onCreateChat={handleCreateSession}
            onOpenSettings={() => { setShowSidebar(false); setCurrentPage('settings'); }}
          />
        </div>
      )}

      <WelcomeModal show={showWelcome} onEnter={() => setShowWelcome(false)} />
    </div>
  );
}
