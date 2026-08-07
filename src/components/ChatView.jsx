import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessage, getMessages, createSession } from '../api.js';
import SettingsView from './SettingsView';
import Sidebar from './Sidebar';
import MemoryView from './MemoryView';
console.log('✅ ChatView 组件已加载');

export default function ChatView({
  chatInfo,
  messages,
  onOpenSidebar,
  onOpenSettings,
  onSendMessage,
  onChangeModel,
  onUpdateChatTitle,
  showSidebar,
  setShowSidebar,
  chatList,
  activeChatId,
  setActiveChatId,
  setChatList
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [showModelSelect, setShowModelSelect] = useState(false);
  const [showMorePanel, setShowMorePanel] = useState(false);
  const [showMemory, setShowMemory] = useState(false);

  const [inputText, setInputText] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatBgImage, setChatBgImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentModel, setCurrentModel] = useState('qwen-plus');

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const bgFileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 清理 Safari blob 预览
  const cleanPreviewUrl = useCallback((url) => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }, []);

  // 加载历史消息
  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
    } else {
      setMessageList([]);
    }
  }, [activeChatId]);

  const loadMessages = async (sessionId) => {
    try {
      const data = await getMessages(sessionId);
      const formatted = data.map(msg => ({
        id: msg.id,
        text: msg.content,
        isSelf: msg.role === 'user',
        time: new Date(msg.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }));
      setMessageList(formatted);
    } catch (error) {
      console.error('加载消息失败:', error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  // 发送消息
  const handleSend = async () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    if (!activeChatId) {
      try {
        const newSession = await createSession('新对话');
        setActiveChatId(newSession.id);
        setChatList(prev => [newSession, ...prev]);
        setTimeout(() => {
          doSendMessage(newSession.id);
        }, 200);
        return;
      } catch (error) {
        console.error('创建会话失败:', error);
        alert('创建会话失败，请检查后端');
        return;
      }
    }
    await doSendMessage(activeChatId);
  };

  const doSendMessage = async (sessionId) => {
    setIsLoading(true);
    const userMessage = inputText.trim();
    const imageData = selectedImage;

    // 临时显示用户消息（乐观更新）
    const tempUserMsg = {
      id: Date.now(),
      text: userMessage,
      image: imageData,
      isSelf: true,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isTemp: true
    };
    setMessageList(prev => [...prev, tempUserMsg]);
    setInputText('');
    if (selectedImage) {
      cleanPreviewUrl(selectedImage);
      setSelectedImage(null);
    }
    setShowMorePanel(false);

    try {
      // 调用后端 API（后端会保存用户消息和 AI 回复）
      const response = await sendMessage(sessionId, userMessage, currentModel);
      console.log('后端返回:', response);

      // ⭐ 关键改动：直接从数据库重新加载所有消息（包括用户消息和 AI 回复）
      await loadMessages(sessionId);
    } catch (error) {
      console.error('发送失败:', error);
      setMessageList(prev => prev.filter(msg => !msg.isTemp));
      alert('发送失败: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (selectedImage) cleanPreviewUrl(selectedImage);
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);
    setShowMorePanel(false);
  };

  const handleChangeBg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (chatBgImage) cleanPreviewUrl(chatBgImage);
    const bgUrl = URL.createObjectURL(file);
    setChatBgImage(bgUrl);
    setShowMorePanel(false);
  };

  const triggerImageSelect = () => fileInputRef.current?.click();
  const triggerBgSelect = () => bgFileInputRef.current?.click();

  const chatAreaStyle = {
    flex: 1,
    overflowY: 'auto',
    backgroundImage: chatBgImage ? `url(${chatBgImage})` : undefined,
    backgroundColor: chatBgImage ? 'transparent' : '#FEF4F8',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    WebkitOverflowScrolling: 'touch'
  };

  const renderMessages = () => {
    if (messageList.length === 0) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#C9AAB2',
          fontSize: 16
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🐰</div>
            <div>开始和 Nana 聊天吧</div>
          </div>
        </div>
      );
    }
    return messageList.map((msg) => (
      <div
        key={msg.id}
        style={{
          display: 'flex',
          justifyContent: msg.isSelf ? 'flex-end' : 'flex-start',
          padding: '10px 16px'
        }}
      >
        <div
          style={{
            maxWidth: '72%',
            backgroundColor: msg.isSelf ? '#F7DCE3' : '#FFFFFF',
            borderRadius: 18,
            padding: '12px 14px',
            boxShadow: '0 2px 6px rgba(140, 84, 104, 0.08)',
            position: 'relative'
          }}
        >
          {msg.image && (
            <img
              src={msg.image}
              alt="msg"
              style={{
                width: '100%',
                borderRadius: 12,
                marginBottom: msg.text ? 10 : 0,
                display: 'block'
              }}
            />
          )}
          {msg.text && (
            <div style={{ color: '#4A3B3F', fontSize: 15, lineHeight: 1.6 }}>
              {msg.text}
              {msg.isTemp && <span style={{ fontSize: 12, color: '#C9AAB2', marginLeft: 8 }}>⏳</span>}
            </div>
          )}
          <div
            style={{
              fontSize: 11,
              color: '#C9AAB2',
              textAlign: 'right',
              marginTop: 6
            }}
          >
            {msg.time}
          </div>
        </div>
      </div>
    ));
  };

  if (showSettings) {
    return (
      <SettingsView
        onBack={() => setShowSettings(false)}
        onOpenMemory={() => {
          setShowSettings(false);
          setShowMemory(true);
        }}
      />
    );
  }

  if (showMemory) {
    return <MemoryView onClose={() => setShowMemory(false)} />;
  }

  return (
    <>
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {showSidebar && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
            <div
              onClick={() => setShowSidebar(false)}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.18)'
              }}
            />
            <Sidebar
              show={showSidebar}
              onClose={() => setShowSidebar(false)}
              chatList={chatList}
              activeChatId={activeChatId}
              onSelectChat={() => setShowSidebar(false)}
              onCreateChat={() => setShowSidebar(false)}
              onOpenSettings={() => {
                setShowSidebar(false);
                setShowSettings(true);
              }}
            />
          </div>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          flexShrink: 0,
          borderBottom: '1px solid #F6DCE2'
        }}>
          <button
            onClick={onOpenSidebar}
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              border: '1px solid #F0D2DC',
              backgroundColor: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 19,
              color: '#8C5468',
              cursor: 'pointer'
            }}
          >
            ☰
          </button>

          <span style={{
            fontSize: 26,
            fontWeight: 600,
            color: '#7B4B70'
          }}>
            Nana
          </span>

          <button
            onClick={() => setShowSettings(true)}
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              border: '1px solid #F0D2DC',
              backgroundColor: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 21,
              color: '#8C5468',
              cursor: 'pointer'
            }}
          >
            ⚙️
          </button>
        </div>

        <div style={{
          width: '100%',
          height: 18,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='18' viewBox='0 0 100 18' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 9c5 0 8-4 12-4s7 4 12 4 8-4 12-4 7 4 12 4 8-4 12-4 7 4 12 4 8-4 12-4 7 4 12 4v9H0V9z' fill='%23F7DCE3' opacity='0.6'/%3E%3Cpath d='M0 14c5 0 8-3 12-3s7 3 12 3 8-3 12-3 7 3 12 3 8-3 12-3 7 3 12 3 8-3 12-3 7 3 12 3v4H0v-4z' fill='%23FCEEF2' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: '100px 18px',
          flexShrink: 0
        }} />

        <div style={chatAreaStyle}>
          {renderMessages()}
          {isLoading && (
            <div style={{ padding: '10px 16px', color: '#C9AAB2', fontSize: 14 }}>
              Nana 正在输入...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {selectedImage && (
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#FFF',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderTop: '1px solid #F6DCE2'
          }}>
            <img
              src={selectedImage}
              alt="preview"
              style={{
                width: 60,
                height: 60,
                objectFit: 'cover',
                borderRadius: 8
              }}
            />
            <button
              onClick={() => {
                cleanPreviewUrl(selectedImage);
                setSelectedImage(null);
              }}
              style={{
                color: '#8C5468',
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                fontSize: 14
              }}
            >
              移除
            </button>
          </div>
        )}

        <div style={{
          width: '100%',
          height: 18,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='18' viewBox='0 0 100 18' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 9c5 0 8-4 12-4s7 4 12 4 8-4 12-4 7 4 12 4 8-4 12-4 7 4 12 4 8-4 12-4 7 4 12 4v9H0V9z' fill='%23F7DCE3' opacity='0.6'/%3E%3Cpath d='M0 14c5 0 8-3 12-3s7 3 12 3 8-3 12-3 7 3 12 3 8-3 12-3 7 3 12 3 8-3 12-3 7 3 12 3v4H0v-4z' fill='%23FCEEF2' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: '100px 18px',
          flexShrink: 0
        }} />

        <div style={{
          flexShrink: 0,
          backgroundColor: '#FFF',
          borderTop: '1px solid #F6DCE2'
        }}>
          <div style={{
            padding: '8px 16px 4px',
            display: 'flex',
            gap: 10
          }}>
            <button
              onClick={() => setShowModelSelect(true)}
              style={{
                height: 40,
                borderRadius: 999,
                border: '1px solid #F0D2DC',
                backgroundColor: '#FEF2F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                color: '#8C5468',
                cursor: 'pointer',
                padding: '0 14px'
              }}
            >
              ⌃ {currentModel}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMemory(true);
              }}
              style={{
                height: 40,
                borderRadius: 999,
                border: '1px solid #F0D2DC',
                backgroundColor: '#FEF2F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                color: '#8C5468',
                cursor: 'pointer',
                padding: '0 14px'
              }}
            >
              📋 记忆库
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 10,
            padding: '8px 16px 12px'
          }}>
            <button
              onClick={handleSend}
              disabled={isLoading}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: isLoading ? '#D4C4C8' : '#A86898',
                border: 'none',
                color: '#FFF',
                fontSize: 18,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              ➤
            </button>

            <input
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="say something to Nana..."
              style={{
                flex: 1,
                minHeight: 48,
                maxHeight: 100,
                borderRadius: 22,
                border: '1px solid #F0D2DC',
                backgroundColor: '#FEF2F5',
                padding: '12px 18px',
                fontSize: 16,
                outline: 'none',
                color: '#444',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />

            <button
              onClick={() => setShowMorePanel(!showMorePanel)}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: '1px solid #F0D2DC',
                backgroundColor: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                color: '#A86898',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              ♡
            </button>
          </div>

          {showMorePanel && (
            <div style={{
              backgroundColor: '#FFF',
              borderTop: '1px solid #F6DCE2',
              padding: '16px 12px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 12
              }}>
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={triggerImageSelect}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 14,
                      backgroundColor: '#FEF2F5',
                      border: 'none',
                      fontSize: 24,
                      color: '#8C5468',
                      cursor: 'pointer'
                    }}
                  >
                    🖼
                  </button>
                  <div style={{ fontSize: 12, color: '#8C5468', marginTop: 4 }}>
                    图片
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={triggerBgSelect}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 14,
                      backgroundColor: '#FEF2F5',
                      border: 'none',
                      fontSize: 24,
                      color: '#8C5468',
                      cursor: 'pointer'
                    }}
                  >
                    🖼
                  </button>
                  <div style={{ fontSize: 12, color: '#8C5468', marginTop: 4 }}>
                    设置背景
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMorePanel(false);
                      setShowMemory(true);
                    }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 14,
                      backgroundColor: '#FEF2F5',
                      border: 'none',
                      fontSize: 24,
                      color: '#8C5468',
                      cursor: 'pointer'
                    }}
                  >
                    📋
                  </button>
                  <div style={{ fontSize: 12, color: '#8C5468', marginTop: 4 }}>
                    记忆库
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 14,
                      backgroundColor: '#FEF2F5',
                      border: 'none',
                      fontSize: 24,
                      color: '#B98A96',
                      cursor: 'not-allowed'
                    }}
                  >
                    📎
                  </button>
                  <div style={{ fontSize: 12, color: '#B98A96', marginTop: 4 }}>
                    文件
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {showModelSelect && (
          <div
            onClick={() => setShowModelSelect(false)}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '80%',
                maxWidth: 320,
                backgroundColor: '#FFF',
                borderRadius: 18,
                overflow: 'hidden'
              }}
            >
              <div style={{
                padding: 16,
                textAlign: 'center',
                fontSize: 17,
                fontWeight: 500,
                color: '#7B4B70',
                borderBottom: '1px solid #F6DCE2'
              }}>
                选择模型
              </div>

              {['qwen-plus', 'claude-sonnet-5', 'deepseek'].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setCurrentModel(m);
                    setShowModelSelect(false);
                  }}
                  style={{
                    width: '100%',
                    padding: 14,
                    textAlign: 'center',
                    border: 'none',
                    backgroundColor: currentModel === m ? '#FEF2F5' : '#FFF',
                    fontSize: 16,
                    color: '#8C5468',
                    cursor: 'pointer'
                  }}
                >
                  {m}
                </button>
              ))}

              <button
                onClick={() => setShowModelSelect(false)}
                style={{
                  width: '100%',
                  padding: 14,
                  textAlign: 'center',
                  border: 'none',
                  borderTop: '1px solid #F6DCE2',
                  backgroundColor: '#FFF',
                  fontSize: 16,
                  color: '#A86898',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleSelectImage}
        />
        <input
          ref={bgFileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleChangeBg}
        />
      </div>
    </>
  );
}