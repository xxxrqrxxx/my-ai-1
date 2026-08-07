import React, { useState } from 'react';
import { createSession } from './api.js';  // ← 新增导入

import Sidebar from './components/Sidebar.jsx';
import ChatView from './components/ChatView.jsx';
import WelcomeModal from './components/WelcomeModal.jsx';
import SettingsView from './components/SettingsView.jsx';
import MemoryView from './components/MemoryView.jsx';
import SettingsDetailView from './components/SettingsDetailView.jsx';

export default function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [chatMap, setChatMap] = useState({});
  const [currentModel, setCurrentModel] = useState("deepseek");

  // 页面层级状态
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [showSettingsDetail, setShowSettingsDetail] = useState(false);

  // 更新对话标题
  const handleUpdateChatTitle = (chatId, newTitle) => {
    setChatList(prev => prev.map(item => {
      if (item.id === chatId) return { ...item, title: newTitle };
      return item;
    }));
  };

  // 新建对话（改为调用后端 API）
  const handleCreateChat = async () => {
    try {
      const newSession = await createSession('新对话');
      const newChatItem = {
        id: newSession.id,
        title: newSession.name || '新对话',
        time: new Date().toLocaleTimeString()
      };
      setChatList(prev => [newChatItem, ...prev]);
      setActiveChatId(newSession.id);
      setShowSidebar(false);
    } catch (error) {
      console.error('创建会话失败:', error);
      alert('创建会话失败，请检查后端');
    }
  };

  const handleWelcomeEnter = () => {
    setShowWelcome(false);
    handleCreateChat();
  };

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setShowSidebar(false);
  };

  const handleSendMessage = (msgObj) => {
    if (!activeChatId) return;
    setChatMap(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), msgObj]
    }));
  };

  // ----- 设置页面跳转逻辑 -----
  const handleOpenSettings = () => {
    setShowSettings(true);
  };
  const handleSettingsBack = () => {
    setShowSettings(false);
  };
  const handleOpenMemory = () => {
    setShowMemory(true);
  };
  const handleMemoryBack = () => {
    setShowMemory(false);
  };
  const handleOpenSettingsDetail = () => {
    setShowSettingsDetail(true);
  };
  const handleSettingsDetailBack = () => {
    setShowSettingsDetail(false);
  };

  const currentChatInfo = activeChatId ? chatList.find(c => c.id === activeChatId) : null;
  const currentMessages = activeChatId ? (chatMap[activeChatId] || []) : [];

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden", position: "relative" }}>
      {!showWelcome && (
        <ChatView
          chatInfo={currentChatInfo}
          messages={currentMessages}
          onOpenSidebar={() => setShowSidebar(true)}
          onOpenSettings={handleOpenSettings}
          onSendMessage={handleSendMessage}
          onChangeModel={(m) => setCurrentModel(m)}
          onUpdateChatTitle={(t) => handleUpdateChatTitle(activeChatId, t)}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          chatList={chatList}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          setChatList={setChatList}
        />
      )}

      <Sidebar
        show={showSidebar}
        onClose={() => setShowSidebar(false)}
        chatList={chatList}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onCreateChat={handleCreateChat}
        onOpenSettings={handleOpenSettings}
      />

      <WelcomeModal show={showWelcome} onEnter={handleWelcomeEnter} />

      {showSettings && (
        <div style={{ position: "absolute", inset: 0, zIndex: 400 }}>
          <SettingsView
            onBack={handleSettingsBack}
            onOpenMemory={handleOpenMemory}
            onOpenSettingsDetail={handleOpenSettingsDetail}
          />
        </div>
      )}

      {showMemory && (
        <div style={{ position: "absolute", inset: 0, zIndex: 410 }}>
          <MemoryView onBack={handleMemoryBack} />
        </div>
      )}

      {showSettingsDetail && (
        <div style={{ position: "absolute", inset: 0, zIndex: 420 }}>
          <SettingsDetailView onBack={handleSettingsDetailBack} />
        </div>
      )}
    </div>
  );
}