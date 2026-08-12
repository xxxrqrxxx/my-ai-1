import React, { useState, useRef, useEffect } from 'react';
import { STATUS_PRESETS, MODELS, POKE_ACTIONS, POKE_PARTS } from '../mockData';
import { sendMessage, getMessages } from '../api';

const Icon = ({ name, size = 20, color = 'var(--text-secondary)' }) => {
  const sw = 1.8;
  switch(name) {
    case 'menu':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
    case 'search':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case 'api':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
    case 'plus':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case 'image':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
    case 'file':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    case 'finger':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>;
    case 'send':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
    case 'chevron':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
    case 'check':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
    case 'x':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    default: return null;
  }
};

export default function ChatView({ aiName, userName, onOpenSidebar, sessionId, settings }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState(STATUS_PRESETS[7]);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showPokePanel, setShowPokePanel] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [thinkingId, setThinkingId] = useState(null);
  const [pokeAction, setPokeAction] = useState(null);
  const [pokePart, setPokePart] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // 切换会话时加载历史消息
  useEffect(() => {
    if (sessionId) loadHistory();
  }, [sessionId]);

  const loadHistory = async () => {
    if (!sessionId) return;
    setLoadingHistory(true);
    try {
      const history = await getMessages(sessionId);
      // 转换格式，加上 time 字段
      const formatted = (history || []).map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        time: m.created_at ? new Date(m.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '',
        thinking: null,
        tools: null,
      }));
      setMessages(formatted);
    } catch (err) {
      console.error('加载历史失败:', err);
      setMessages([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  // 搜索过滤
  const filteredMessages = searchQuery.trim()
    ? messages.filter(m => m.content?.includes(searchQuery.trim()))
    : messages;

  const handleSend = async () => {
    if (!inputText.trim() && !pokeAction && !selectedImage && !selectedFile) return;
    if (!sessionId) return;
    
    // 单独发戳一戳
    if (pokeAction && pokePart && !inputText.trim() && !selectedImage && !selectedFile) {
      const pokeMsg = {
        id: Date.now(),
        role: 'system',
        content: `${userName}${pokeAction}${aiName}的${pokePart}`,
        time: getTime(),
      };
      setMessages(prev => [...prev, pokeMsg]);
      setPokeAction(null);
      setPokePart(null);
      setShowPlusMenu(false);
      return;
    }
    
    let content = inputText;
    if (pokeAction && pokePart) {
      content = `[${pokeAction}了${pokePart}] ${inputText}`.trim();
    }
    if (selectedImage) content = '[图片] ' + content;
    if (selectedFile) content = `[文件: ${selectedFile.name}] ` + content;
    
    // 先显示用户消息
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content,
      time: getTime(),
    };
    setMessages(prev => [...prev, userMsg]);
    
    setInputText('');
    setPokeAction(null);
    setPokePart(null);
    setSelectedImage(null);
    setSelectedFile(null);
    setShowPlusMenu(false);
    setIsTyping(true);
    setStatus(STATUS_PRESETS[0]);

    // 调用真实 API
    try {
      const modelName = selectedModel?.id || settings?.model || 'gemini-2.0-flash';
      const result = await sendMessage(sessionId, content, modelName);
      
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: result.reply,
        time: getTime(),
        thinking: null,
        tools: null,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('发送失败:', err);
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '抱歉，出了点小问题，再试一次好吗？',
        time: getTime(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setStatus(STATUS_PRESETS[7]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const confirmPoke = () => {
    if (pokeAction && pokePart) {
      setShowPokePanel(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedImage(file);
    setShowPlusMenu(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
    setShowPlusMenu(false);
  };

  return (
    <div className="page-container" onClick={() => setShowPlusMenu(false)}>
      {/* 顶部栏 - 向下模糊渐变 */}
      <div className="glass-header" style={{
        position: 'relative',
        zIndex: 50,
        flexShrink: 0,
        paddingTop: 'env(safe-area-inset-top)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
        }}>
          <button onClick={onOpenSidebar} className="jelly-button" style={{ width: 40, height: 40 }}>
            <Icon name="menu" />
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', flex: 1, textAlign: 'center' }}>
            {aiName}
          </h2>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={(e) => { e.stopPropagation(); setShowSearch(!showSearch); }} className="jelly-button" style={{ width: 38, height: 38 }}>
              <Icon name="search" size={18} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setShowModelPicker(true); }} className="jelly-button" style={{ width: 38, height: 38 }}>
              <Icon name="api" size={18} />
            </button>
          </div>
        </div>
        
        {/* 搜索框 */}
        {showSearch && (
          <div style={{ padding: '0 16px 12px' }} onClick={(e) => e.stopPropagation()}>
            <div className="jelly-card" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px',
            }}>
              <Icon name="search" size={16} />
              <input
                type="text"
                placeholder="搜索聊天记录..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: 14, color: 'var(--text-primary)', outline: 'none',
                }}
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', padding: 2 }}>
                  <Icon name="x" size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 消息区域 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 12 }}>
          {loadingHistory && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, padding: 20 }}>
              加载消息中...
            </div>
          )}
          {!loadingHistory && messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: 40 }}>
              和 {aiName} 说点什么吧～
            </div>
          )}
          {filteredMessages.map(msg => {
            if (msg.role === 'system') {
              return (
                <div key={msg.id} style={{ textAlign: 'center', margin: '8px 0' }}>
                  <span className="poke-system-msg">
                    {msg.content}
                  </span>
                </div>
              );
            }
            return (
              <div key={msg.id} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                width: '100%',
              }}>
                {msg.role === 'assistant' && msg.thinking && (
                  <div className="thinking-chain" onClick={() => setThinkingId(msg.id)}>
                    <span className="thinking-chain-icon" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.thinking}</span>
                    <Icon name="chevron" size={12} />
                  </div>
                )}
                
                {msg.tools && (
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4, paddingLeft: 4 }}>
                    {msg.tools.map((t, i) => (
                      <span key={i} className="tag" style={{ fontSize: 10, padding: '2px 8px' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className={msg.role === 'user' ? 'bubble-user' : 'bubble-ai'} style={{
                  padding: '12px 16px',
                  fontSize: 15,
                  lineHeight: 1.6,
                  maxWidth: '80%',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {msg.content}
                </div>
                
                <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, padding: '0 6px' }}>
                  {msg.time}
                </span>
              </div>
            );
          })}
          
          {isTyping && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div className="bubble-ai" style={{ padding: '14px 18px' }}>
                <span className="thinking-dots"><span /><span /><span /></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div style={{
        flexShrink: 0,
        padding: '8px 12px calc(92px + var(--safe-bottom))',
        background: 'linear-gradient(to top, var(--bg-primary) 80%, transparent)',
      }}>
        <div className="status-bar" style={{ marginBottom: 6 }}>
          <span className="status-item">
            <span className="status-dot" />
            {status.zh}
          </span>
        </div>
        
        {/* 图片/文件预览 - 居中 */}
        {(selectedImage || selectedFile) && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6, gap: 8 }}>
            {selectedImage && (
              <div className="jelly-card" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <Icon name="image" size={14} color="var(--accent)" />
                <span>图片已选择</span>
                <button onClick={() => setSelectedImage(null)} style={{ background: 'none', border: 'none', padding: 2 }}>
                  <Icon name="x" size={12} />
                </button>
              </div>
            )}
            {selectedFile && (
              <div className="jelly-card" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <Icon name="file" size={14} color="var(--accent)" />
                <span>{selectedFile.name}</span>
                <button onClick={() => setSelectedFile(null)} style={{ background: 'none', border: 'none', padding: 2 }}>
                  <Icon name="x" size={12} />
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* 戳一戳预览 - 居中，格式 Nana捏捏Arden的头发 */}
        {pokeAction && pokePart && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
            <div className="poke-system-msg" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', fontSize: 13,
            }}>
              <Icon name="finger" size={14} color="var(--accent)" />
              <span>{userName}{pokeAction}{aiName}的{pokePart}</span>
              <button onClick={() => { setPokeAction(null); setPokePart(null); }} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 2,
              }}>
                <Icon name="x" size={14} />
              </button>
            </div>
          </div>
        )}
        
        <div style={{ position: 'relative' }}>
          {/* +号弹出菜单 - 离+号更近，透明果冻磨砂 */}
          {showPlusMenu && (
            <div className="plus-menu" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => imageInputRef.current?.click()}
                className="plus-menu-item"
              >
                <Icon name="image" size={18} color="var(--accent)" />
                <span>添加图片</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="plus-menu-item"
              >
                <Icon name="file" size={18} color="var(--accent)" />
                <span>添加文件</span>
              </button>
              <button
                onClick={() => { setShowPokePanel(true); setShowPlusMenu(false); }}
                className="plus-menu-item"
              >
                <Icon name="finger" size={18} color="var(--accent)" />
                <span>戳一戳</span>
              </button>
            </div>
          )}
          
          <div className="jelly-card" style={{
            display: 'flex', alignItems: 'flex-end', gap: 6, padding: 6,
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowPlusMenu(!showPlusMenu)} className="jelly-button" style={{ width: 38, height: 38 }}>
                <Icon name="plus" />
              </button>
              <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageSelect} />
              <input ref={fileInputRef} type="file" accept=".docx,.txt,.pdf" style={{ display: 'none' }} onChange={handleFileSelect} />
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="说点什么..."
              rows={1}
              style={{
                flex: 1, border: 'none', background: 'transparent',
                padding: '10px 4px', fontSize: 15, color: 'var(--text-primary)',
                outline: 'none', resize: 'none', maxHeight: 100, fontFamily: 'inherit',
              }}
            />
            
            <button onClick={handleSend} className="jelly-button jelly-button-accent" style={{ width: 40, height: 40 }}>
              <Icon name="send" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 思考链弹窗 - 半屏 */}
      {thinkingId && (
        <div className="modal-overlay" onClick={() => setThinkingId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14, marginTop: 8 }}>
              Thought process
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              {messages.find(m => m.id === thinkingId)?.thinking}
            </p>
            <button onClick={() => setThinkingId(null)} className="jelly-button jelly-button-accent" style={{
              width: '100%', height: 44, marginTop: 18, borderRadius: 22, fontSize: 15,
            }}>
              知道了
            </button>
          </div>
        </div>
      )}

      {/* 戳一戳面板 - 半屏 */}
      {showPokePanel && (
        <div className="modal-overlay" onClick={() => setShowPokePanel(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 18, marginTop: 8 }}>
              戳一戳
            </h3>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>动作</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {POKE_ACTIONS.map(action => (
                  <button key={action} onClick={() => setPokeAction(action)} className="jelly-button" style={{
                    width: 'auto', height: 34, padding: '0 14px', borderRadius: 17, fontSize: 13,
                    background: pokeAction === action ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                    color: pokeAction === action ? 'white' : 'var(--text-secondary)',
                  }}>
                    {action}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>落在哪</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {POKE_PARTS.map(part => (
                  <button key={part} onClick={() => setPokePart(part)} className="jelly-button" style={{
                    width: 'auto', height: 34, padding: '0 14px', borderRadius: 17, fontSize: 13,
                    background: pokePart === part ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                    color: pokePart === part ? 'white' : 'var(--text-secondary)',
                  }}>
                    {part}
                  </button>
                ))}
              </div>
            </div>
            
            <button onClick={confirmPoke} className="jelly-button jelly-button-accent" style={{
              width: '100%', height: 48, borderRadius: 24, fontSize: 15, fontWeight: 600,
            }}>
              就这一下
            </button>
          </div>
        </div>
      )}

      {/* 模型选择 - 半屏，只显示Gemini系列 */}
      {showModelPicker && (
        <div className="modal-overlay" onClick={() => setShowModelPicker(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 16, marginTop: 8 }}>
              选择模型
            </h3>
            {MODELS.map(model => (
              <div key={model.id} onClick={() => { setSelectedModel(model); setShowModelPicker(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: 14, borderRadius: 14, cursor: 'pointer',
                marginBottom: 6,
                background: selectedModel.id === model.id ? 'var(--accent-lighter)' : 'transparent',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="api" size={18} color="var(--accent)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>{model.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{model.defaultModel}</div>
                </div>
                {selectedModel.id === model.id && <Icon name="check" size={18} color="var(--accent)" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
