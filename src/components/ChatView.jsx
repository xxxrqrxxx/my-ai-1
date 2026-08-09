import React, { useState, useRef, useEffect } from 'react';
import { mockMessages, STATUS_PRESETS, MODELS, POKE_ACTIONS, POKE_PARTS } from '../mockData';

const Icon = ({ name, size = 20, color = 'var(--text-secondary)' }) => {
  const sw = 1.8;
  switch(name) {
    case 'menu':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
    case 'memory':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
    case 'chart':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
    case 'model':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>;
    case 'plus':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case 'send':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
    case 'image':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
    case 'file':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    case 'poke':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'x':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    case 'chevron-down':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;
    case 'check':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
    default: return null;
  }
};

// 思考链弹窗
function ThoughtModal({ show, thought, onClose }) {
  if (!show) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
        position: 'absolute', bottom: 0, left: 0, right: 0,
        maxHeight: '60vh',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Thought process</h3>
          <button onClick={onClose} className="jelly-button" style={{ width: 30, height: 30 }}>
            <Icon name="x" size={16} />
          </button>
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)', overflowY: 'auto', maxHeight: 'calc(60vh - 60px)' }}>
          {thought}
        </div>
      </div>
    </div>
  );
}

// 戳一戳选择面板
function PokePanel({ show, onSelect, onClose }) {
  const [action, setAction] = useState('戳戳');
  const [part, setPart] = useState('脸');
  
  if (!show) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
        position: 'absolute', bottom: 0, left: 0, right: 0,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>戳一戳 Arden</h3>
          <button onClick={onClose} className="jelly-button" style={{ width: 30, height: 30 }}>
            <Icon name="x" size={16} />
          </button>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>动作</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {POKE_ACTIONS.map(a => (
              <button
                key={a}
                onClick={() => setAction(a)}
                style={{
                  padding: '6px 14px', borderRadius: 14, border: 'none', fontSize: 13, cursor: 'pointer',
                  background: action === a ? 'var(--bg-accent)' : 'var(--glass-bg)',
                  color: action === a ? 'white' : 'var(--text-secondary)',
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>部位</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {POKE_PARTS.map(p => (
              <button
                key={p}
                onClick={() => setPart(p)}
                style={{
                  padding: '6px 14px', borderRadius: 14, border: 'none', fontSize: 13, cursor: 'pointer',
                  background: part === p ? 'var(--bg-accent)' : 'var(--glass-bg)',
                  color: part === p ? 'white' : 'var(--text-secondary)',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => { onSelect(action, part); onClose(); }}
          className="jelly-button jelly-button-accent"
          style={{ width: '100%', height: 44, borderRadius: 22, fontSize: 15 }}
        >
          确定
        </button>
      </div>
    </div>
  );
}

// 模型选择面板
function ModelPanel({ show, currentModel, onSelect, onClose }) {
  if (!show) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
        position: 'absolute', bottom: 0, left: 0, right: 0,
        maxHeight: '70vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, position: 'sticky', top: 0, background: 'var(--bg-card-solid)', zIndex: 1, paddingBottom: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>选择模型</h3>
          <button onClick={onClose} className="jelly-button" style={{ width: 30, height: 30 }}>
            <Icon name="x" size={16} />
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MODELS.map(model => (
            <button
              key={model.id}
              onClick={() => { onSelect(model.id); onClose(); }}
              className="jelly-card"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', width: '100%', textAlign: 'left',
                border: 'none', cursor: 'pointer',
                background: currentModel === model.id ? 'var(--bg-accent-light)' : 'var(--glass-bg)',
              }}
            >
              <div style={{
                width: 8, height: 8, borderRadius: 2,
                background: 'var(--bg-accent)',
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{model.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{model.defaultModel}</div>
              </div>
              {currentModel === model.id && (
                <Icon name="check" size={18} color="var(--bg-accent)" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatView({ onOpenSidebar, onOpenMemory, onOpenUsage }) {
  const [messages, setMessages] = useState(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const [currentStatus, setCurrentStatus] = useState(STATUS_PRESETS[0]);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showThoughtModal, setShowThoughtModal] = useState(false);
  const [currentThought, setCurrentThought] = useState('');
  const [showPokePanel, setShowPokePanel] = useState(false);
  const [showModelPanel, setShowModelPanel] = useState(false);
  const [currentModel, setCurrentModel] = useState('qwen');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pendingPoke, setPendingPoke] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 随机切换状态
  useEffect(() => {
    const timer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * STATUS_PRESETS.length);
      setCurrentStatus(STATUS_PRESETS[randomIndex]);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleSend = () => {
    if (!inputValue.trim() && !selectedImage && !selectedFile && !pendingPoke) return;
    
    // 戳一戳单独发
    if (pendingPoke && !inputValue.trim() && !selectedImage && !selectedFile) {
      const pokeMsg = {
        id: Date.now(),
        type: 'system',
        content: `Nana ${pendingPoke.action}了 Arden 的${pendingPoke.part}`,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, pokeMsg]);
      setPendingPoke(null);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'ai',
          content: '哎呀～ 被你发现了！(,,> ω <,,)',
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          thought: 'Nana戳我了！好开心！要表现得害羞一点，不能太主动，但也不能太冷淡。就用可爱的语气回应吧。',
          tools: [],
        }]);
      }, 1500);
      return;
    }
    
    const newMsg = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      image: selectedImage,
      file: selectedFile,
      poke: pendingPoke,
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setSelectedImage(null);
    setSelectedFile(null);
    setPendingPoke(null);
    setShowPlusMenu(false);
    
    // 模拟AI回复
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        content: '收到啦宝贝～ 我记下来了哦！',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        thought: '用户发了一条消息，我需要认真思考一下怎么回复比较好。首先要理解用户的意图，然后组织语言，保持温柔的语气。',
        tools: ['记忆系统'],
      }]);
    }, 2000);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
    setShowPlusMenu(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile({ name: file.name, size: file.size });
    }
    setShowPlusMenu(false);
  };

  const handlePokeSelect = (action, part) => {
    setPendingPoke({ action, part });
  };

  const openThought = (thought) => {
    setCurrentThought(thought);
    setShowThoughtModal(true);
  };

  return (
    <div className="page-container">
      {/* 顶部栏 - 固定不随滚动移动 */}
      <div className="glass-header" style={{
        position: 'relative',
        zIndex: 50,
        flexShrink: 0,
        paddingTop: 'env(safe-area-inset-top)',
        borderBottom: 'none',
        boxShadow: '0 6px 24px rgba(200, 130, 160, 0.06)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 12px',
        }}>
          <button onClick={onOpenSidebar} className="jelly-button" style={{ width: 38, height: 38 }}>
            <Icon name="menu" size={20} />
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
              Arden
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={onOpenMemory} className="jelly-button" style={{ width: 38, height: 38 }}>
              <Icon name="memory" size={18} />
            </button>
            <button onClick={onOpenUsage} className="jelly-button" style={{ width: 38, height: 38 }}>
              <Icon name="chart" size={18} />
            </button>
            <button onClick={() => setShowModelPanel(true)} className="jelly-button" style={{ width: 38, height: 38 }}>
              <Icon name="model" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 消息区域 - 可滚动 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 0' }}>
        {messages.map(msg => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id} style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                <div style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  background: 'var(--glass-bg)',
                  padding: '6px 14px',
                  borderRadius: 14,
                  backdropFilter: 'blur(10px)',
                }}>
                  {msg.content}
                </div>
              </div>
            );
          }
          
          const isUser = msg.type === 'user';
          return (
            <div key={msg.id} style={{
              display: 'flex',
              justifyContent: isUser ? 'flex-end' : 'flex-start',
              marginBottom: 16,
            }}>
              <div style={{ maxWidth: '78%' }}>
                {/* 思考链 - 气泡上方 */}
                {!isUser && msg.thinking && (
                  <div
                    className="thinking-chain"
                    onClick={() => openThought(msg.thinking)}
                    style={{ marginBottom: 4, marginLeft: 8 }}
                  >
                    <span style={{
                      display: 'inline-block',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}>
                      {msg.thinking}
                    </span>
                    <Icon name="chevron-down" size={12} />
                  </div>
                )}
                
                {/* 气泡 */}
                <div
                  className={`bubble ${isUser ? 'bubble-user' : 'bubble-ai'}`}
                  style={{ position: 'relative' }}
                >
                  {/* 图片 */}
                  {msg.image && (
                    <img src={msg.image} alt="" style={{
                      width: '100%', borderRadius: 12, marginBottom: 8,
                    }} />
                  )}
                  
                  {/* 文件 */}
                  {msg.file && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 10px',
                      background: isUser ? 'rgba(255,255,255,0.2)' : 'var(--glass-bg)',
                      borderRadius: 10,
                      marginBottom: 8,
                    }}>
                      <Icon name="file" size={16} color={isUser ? 'white' : 'var(--text-secondary)'} />
                      <span style={{ fontSize: 13, color: isUser ? 'white' : 'var(--text-secondary)' }}>
                        {msg.file.name}
                      </span>
                    </div>
                  )}
                  
                  {/* 戳一戳标记 */}
                  {msg.poke && (
                    <div style={{
                      fontSize: 12,
                      color: isUser ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)',
                      marginBottom: 4,
                      fontStyle: 'italic',
                    }}>
                      [{msg.poke.action}了一下]
                    </div>
                  )}
                  
                  {msg.content}
                </div>
                
                {/* 工具调用 - 气泡下方 */}
                {!isUser && msg.tools && msg.tools.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, marginLeft: 8 }}>
                    {msg.tools.map((tool, i) => (
                      <span key={i} className="tag" style={{ fontSize: 10 }}>
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* 时间 */}
                <div style={{
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  marginTop: 4,
                  textAlign: isUser ? 'right' : 'left',
                  marginRight: isUser ? 4 : 8,
                }}>
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* 输入中状态 */}
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
            <div className="bubble bubble-ai" style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <span className="typing-dot" style={{ animationDelay: '0s' }} />
                <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
                <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 - 固定在底部 */}
      <div style={{
        flexShrink: 0,
        padding: '8px 12px calc(88px + var(--safe-bottom))',
        background: 'linear-gradient(to top, var(--bg-primary) 80%, transparent)',
      }}>
        {/* 状态栏 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 8,
        }}>
          <div className="status-bar">
            <span className="status-dot" />
            {currentStatus.zh}
          </div>
        </div>
        
        {/* 预览条 */}
        {(selectedImage || selectedFile || pendingPoke) && (
          <div style={{
            display: 'flex',
            gap: 8,
            marginBottom: 8,
            padding: '0 4px',
            flexWrap: 'wrap',
          }}>
            {selectedImage && (
              <div style={{ position: 'relative' }}>
                <img src={selectedImage} alt="" style={{
                  width: 60, height: 60, borderRadius: 10, objectFit: 'cover',
                }} />
                <button
                  onClick={() => setSelectedImage(null)}
                  style={{
                    position: 'absolute', top: -4, right: -4,
                    width: 20, height: 20, borderRadius: 10,
                    background: 'var(--bg-accent)',
                    border: '2px solid var(--bg-primary)',
                    color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 10,
                  }}
                >
                  <Icon name="x" size={10} color="white" />
                </button>
              </div>
            )}
            {selectedFile && (
              <div style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 12px',
                background: 'var(--glass-bg)',
                borderRadius: 10,
                fontSize: 12,
                color: 'var(--text-secondary)',
              }}>
                <Icon name="file" size={14} />
                {selectedFile.name}
                <button
                  onClick={() => setSelectedFile(null)}
                  style={{
                    position: 'absolute', top: -4, right: -4,
                    width: 20, height: 20, borderRadius: 10,
                    background: 'var(--bg-accent)',
                    border: '2px solid var(--bg-primary)',
                    color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 10,
                  }}
                >
                  <Icon name="x" size={10} color="white" />
                </button>
              </div>
            )}
            {pendingPoke && (
              <div style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 12px',
                background: 'var(--bg-accent-light)',
                borderRadius: 10,
                fontSize: 12,
                color: 'var(--bg-accent)',
              }}>
                <Icon name="poke" size={14} />
                {pendingPoke.action} {pendingPoke.part}
                <button
                  onClick={() => setPendingPoke(null)}
                  style={{
                    position: 'absolute', top: -4, right: -4,
                    width: 20, height: 20, borderRadius: 10,
                    background: 'var(--bg-accent)',
                    border: '2px solid var(--bg-primary)',
                    color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 10,
                  }}
                >
                  <Icon name="x" size={10} color="white" />
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* +号弹出菜单 */}
        {showPlusMenu && (
          <div style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            padding: 8,
            background: 'var(--bg-card-solid)',
            backdropFilter: 'blur(40px) saturate(1.8)',
            borderRadius: 16,
            boxShadow: '0 8px 30px var(--shadow-strong)',
            border: '1px solid var(--glass-border)',
            zIndex: 100,
          }}>
            <button
              onClick={() => imageInputRef.current?.click()}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                background: 'transparent',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 14,
                color: 'var(--text-secondary)',
                textAlign: 'left',
                minWidth: 120,
              }}
            >
              <Icon name="image" size={16} />
              图片
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                background: 'transparent',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 14,
                color: 'var(--text-secondary)',
                textAlign: 'left',
                minWidth: 120,
              }}
            >
              <Icon name="file" size={16} />
              文件
            </button>
            <button
              onClick={() => { setShowPokePanel(true); setShowPlusMenu(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                background: 'transparent',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 14,
                color: 'var(--text-secondary)',
                textAlign: 'left',
                minWidth: 120,
              }}
            >
              <Icon name="poke" size={16} />
              戳一戳
            </button>
          </div>
        )}
        
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 8,
          position: 'relative',
        }}>
          <button
            onClick={() => setShowPlusMenu(!showPlusMenu)}
            className="jelly-button"
            style={{ width: 40, height: 40, flexShrink: 0 }}
          >
            <Icon name="plus" size={20} />
          </button>
          
          <div style={{ flex: 1 }}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="说点什么..."
              rows={1}
              style={{
                width: '100%',
                border: 'none',
                borderRadius: 20,
                padding: '10px 16px',
                fontSize: 15,
                color: 'var(--text-primary)',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(10px)',
                outline: 'none',
                resize: 'none',
                maxHeight: 120,
                lineHeight: 1.5,
                fontFamily: 'inherit',
              }}
            />
          </div>
          
          <button
            onClick={handleSend}
            className="jelly-button jelly-button-accent"
            style={{ width: 40, height: 40, flexShrink: 0 }}
          >
            <Icon name="send" size={18} color="white" />
          </button>
        </div>
        
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageSelect}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.docx,.pdf,.md"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </div>

      <ThoughtModal
        show={showThoughtModal}
        thought={currentThought}
        onClose={() => setShowThoughtModal(false)}
      />
      
      <PokePanel
        show={showPokePanel}
        onSelect={handlePokeSelect}
        onClose={() => setShowPokePanel(false)}
      />
      
      <ModelPanel
        show={showModelPanel}
        currentModel={currentModel}
        onSelect={setCurrentModel}
        onClose={() => setShowModelPanel(false)}
      />
    </div>
  );
}