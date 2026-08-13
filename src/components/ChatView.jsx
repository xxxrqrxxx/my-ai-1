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
    case 'zoom':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>;
    case 'download':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
    default: return null;
  }
};

// 文件卡片组件
const FileCard = ({ file, isUser, onClick }) => {
  const ext = file.name.split('.').pop().toUpperCase();
  return (
    <div onClick={onClick} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 12px 10px 10px',
      borderRadius: 18,
      background: isUser ? 'var(--accent-lighter)' : 'var(--glass-bg)',
      backdropFilter: 'blur(20px)',
      border: '1px solid var(--glass-border)',
      boxShadow: isUser ? 'none' : 'var(--shadow)',
      maxWidth: 260,
      minWidth: 170,
      cursor: 'pointer',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 12,
        background: 'var(--accent-gradient)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: 'var(--shadow-accent)',
      }}>
        <Icon name="file" size={18} color="white" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, color: 'var(--text-primary)', fontWeight: 500,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {file.name}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
          点击预览
        </div>
      </div>
      <span style={{
        fontSize: 9,
        background: isUser ? 'var(--accent)' : 'var(--accent-lighter)',
        color: isUser ? 'white' : 'var(--accent)',
        padding: '2px 7px',
        borderRadius: 6,
        fontWeight: 700,
        flexShrink: 0,
        letterSpacing: 0.5,
      }}>
        {ext}
      </span>
    </div>
  );
};

// 图片卡片组件
const ImageCard = ({ src, onClick }) => {
  return (
    <div onClick={onClick} style={{
      width: 180,
      height: 180,
      borderRadius: 18,
      overflow: 'hidden',
      cursor: 'pointer',
      border: '2px solid var(--accent-lighter)',
      boxShadow: 'var(--shadow)',
      position: 'relative',
    }}>
      <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div style={{
        position: 'absolute', bottom: 8, right: 8,
        width: 28, height: 28, borderRadius: 14,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="zoom" size={14} color="white" />
      </div>
    </div>
  );
};

// 文件预览弹窗 - 底部半框
const FilePreviewModal = ({ file, onClose }) => {
  const ext = file.name.split('.').pop().toLowerCase();
  const isHtml = ext === 'html' || ext === 'htm';
  const isPdf = ext === 'pdf';
  const isText = ['txt', 'md', 'csv', 'json', 'js', 'css'].includes(ext);

  const handleDownload = () => {
    if (isPdf && file.dataUrl) {
      const a = document.createElement('a');
      a.href = file.dataUrl;
      a.download = file.name;
      a.click();
      return;
    }
    let mimeType = 'text/plain';
    if (isHtml) mimeType = 'text/html';
    const blob = new Blob([file.content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%',
        maxWidth: 500,
        maxHeight: '82vh',
        background: 'var(--bg-primary)',
        borderRadius: '24px 24px 0 0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--text-muted)', opacity: 0.3 }} />
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px 12px',
          borderBottom: '1px solid var(--glass-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'var(--accent-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon name="file" size={16} color="white" />
            </div>
            <span style={{
              fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {file.name}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={handleDownload} style={{
              width: 34, height: 34, borderRadius: 17,
              background: 'var(--glass-bg)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <Icon name="download" size={16} />
            </button>
            <button onClick={onClose} style={{
              width: 34, height: 34, borderRadius: 17,
              background: 'var(--glass-bg)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <Icon name="x" size={16} />
            </button>
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto', background: 'white' }}>
          {isHtml && file.content && (
            <iframe
              srcDoc={file.content}
              style={{ width: '100%', height: '100%', border: 'none', minHeight: 500 }}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          )}
          {isPdf && file.dataUrl && (
            <iframe
              src={file.dataUrl}
              style={{ width: '100%', height: '100%', border: 'none', minHeight: 500 }}
            />
          )}
          {isText && file.content && (
            <pre style={{
              margin: 0, padding: 16, fontSize: 13, lineHeight: 1.6,
              color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              fontFamily: 'monospace',
            }}>
              {file.content}
            </pre>
          )}
          {!isHtml && !isPdf && !isText && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              该文件类型暂不支持预览
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// AI 生成的 HTML 预览
const HtmlPreview = ({ html }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenNew = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div style={{
      marginTop: 8, maxWidth: '88%', alignSelf: 'flex-start',
      borderRadius: 18, overflow: 'hidden',
      background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
      border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        background: 'linear-gradient(135deg, rgba(245,202,216,0.45), rgba(240,188,204,0.3))',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF8A80' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFD180' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#B9F6CA' }} />
          <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>页面预览</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={handleCopy} style={{
            background: 'var(--glass-bg-strong)', border: 'none', borderRadius: 8,
            padding: '4px 10px', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer',
          }}>
            {copied ? '已复制' : '复制代码'}
          </button>
          <button onClick={handleOpenNew} style={{
            background: 'var(--glass-bg-strong)', border: 'none', borderRadius: 8,
            padding: '4px 10px', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer',
          }}>
            新窗口
          </button>
        </div>
      </div>
      {expanded ? (
        <div style={{ position: 'relative' }}>
          <iframe
            srcDoc={html}
            style={{ width: '100%', height: 420, border: 'none', background: 'white', display: 'block' }}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
          <button onClick={() => setExpanded(false)} style={{
            position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14,
            background: 'rgba(0,0,0,0.4)', border: 'none', color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="x" size={14} color="white" />
          </button>
        </div>
      ) : (
        <div onClick={() => setExpanded(true)} style={{ padding: '28px 20px', textAlign: 'center', cursor: 'pointer' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 24, background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px', boxShadow: 'var(--shadow-accent)',
          }}>
            <Icon name="api" size={22} color="white" />
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500, marginBottom: 4 }}>点击展开预览</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Arden 生成的 HTML 页面</div>
        </div>
      )}
    </div>
  );
};

const extractHtmlBlocks = (content) => {
  const htmlRegex = /```html\s*([\s\S]*?)```/gi;
  const blocks = [];
  let match;
  while ((match = htmlRegex.exec(content)) !== null) {
    blocks.push(match[1].trim());
  }
  const text = content.replace(/```html\s*[\s\S]*?```/gi, '').trim();
  return { text, htmlBlocks: blocks };
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
  const [previewImage, setPreviewImage] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (sessionId) loadHistory();
  }, [sessionId]);

  const loadHistory = async () => {
    if (!sessionId) return;
    setLoadingHistory(true);
    try {
      const history = await getMessages(sessionId);
      const formatted = (history || []).map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        time: m.created_at ? new Date(m.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '',
        thinking: null,
        tools: null,
        // 从后端 file_data 恢复图片和文件
        image: m.file_data?.image || null,
        file: m.file_data?.file || null,
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

  const filteredMessages = searchQuery.trim()
    ? messages.filter(m => m.content?.includes(searchQuery.trim()))
    : messages;

  const handleSend = async () => {
    if (!inputText.trim() && !pokeAction && !selectedImage && !selectedFile) return;
    if (!sessionId) return;

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

    let displayContent = inputText;
    if (pokeAction && pokePart) {
      displayContent = `[${pokeAction}了${pokePart}] ${inputText}`.trim();
    }

    let sendContent = displayContent;
    if (selectedImage) sendContent = '[图片] ' + sendContent;
    if (selectedFile?.content) {
      sendContent = `[文件: ${selectedFile.name}]\n\n${selectedFile.content}\n\n[文件结束] ${sendContent}`.trim();
    } else if (selectedFile) {
      sendContent = `[文件: ${selectedFile.name}] ${sendContent}`.trim();
    }

    // 构造要存到后端的文件数据
    const fileData = {
      image: selectedImage ? selectedImage.dataUrl : null,
      file: selectedFile ? { ...selectedFile } : null,
    };

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: displayContent,
      time: getTime(),
      file: selectedFile ? { ...selectedFile } : null,
      image: selectedImage ? selectedImage.dataUrl : null,
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

    try {
      const modelName = selectedModel?.id || settings?.model || 'gemini-2.0-flash';
      const result = await sendMessage(sessionId, sendContent, modelName, fileData);

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: result.reply,
        time: getTime(),
        thinking: null,
        tools: null,
        image: null,
        file: null,
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
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedImage({
        name: file.name,
        dataUrl: ev.target.result,
      });
    };
    reader.readAsDataURL(file);
    setShowPlusMenu(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    const isText = ['txt', 'html', 'htm', 'md', 'csv', 'json', 'js', 'css'].includes(ext);
    const isPdf = ext === 'pdf';

    if (isText) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedFile({
          name: file.name,
          content: ev.target.result,
          type: 'text',
        });
      };
      reader.readAsText(file);
    } else if (isPdf) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedFile({
          name: file.name,
          content: null,
          dataUrl: ev.target.result,
          type: 'pdf',
        });
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile({
        name: file.name,
        content: null,
        dataUrl: null,
        type: 'binary',
      });
    }
    setShowPlusMenu(false);
  };

  return (
    <div className="page-container" onClick={() => setShowPlusMenu(false)}>
      <div className="glass-header" style={{
        position: 'relative', zIndex: 50, flexShrink: 0,
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
        {showSearch && (
          <div style={{ padding: '0 16px 12px' }} onClick={(e) => e.stopPropagation()}>
            <div className="jelly-card" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px' }}>
              <Icon name="search" size={16} />
              <input
                type="text" placeholder="搜索聊天记录..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
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

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 12 }}>
          {loadingHistory && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, padding: 20 }}>加载消息中...</div>
          )}
          {!loadingHistory && messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: 40 }}>和 {aiName} 说点什么吧～</div>
          )}
          {filteredMessages.map(msg => {
            if (msg.role === 'system') {
              return (
                <div key={msg.id} style={{ textAlign: 'center', margin: '8px 0' }}>
                  <span className="poke-system-msg">{msg.content}</span>
                </div>
              );
            }
            return (
              <div key={msg.id} style={{
                display: 'flex', flexDirection: 'column',
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
                      <span key={i} className="tag" style={{ fontSize: 10, padding: '2px 8px' }}>{t}</span>
                    ))}
                  </div>
                )}

                {msg.role === 'assistant' ? (() => {
                  const { text, htmlBlocks } = extractHtmlBlocks(msg.content);
                  return (
                    <>
                      {text && (
                        <div className="bubble-ai" style={{
                          padding: '12px 16px', fontSize: 15, lineHeight: 1.6,
                          maxWidth: '80%', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                          borderRadius: 20,
                        }}>
                          {text}
                        </div>
                      )}
                      {htmlBlocks.map((html, i) => <HtmlPreview key={i} html={html} />)}
                    </>
                  );
                })() : (
                  <>
                    {msg.image && <ImageCard src={msg.image} onClick={() => setPreviewImage(msg.image)} />}
                    {msg.file && <FileCard file={msg.file} isUser={true} onClick={() => setPreviewFile(msg.file)} />}
                    {msg.content && (
                      <div className="bubble-user" style={{
                        padding: '12px 16px', fontSize: 15, lineHeight: 1.6,
                        maxWidth: '80%', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        borderRadius: 20,
                      }}>
                        {msg.content}
                      </div>
                    )}
                  </>
                )}

                <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, padding: '0 6px' }}>
                  {msg.time}
                </span>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div className="bubble-ai" style={{ padding: '14px 18px', borderRadius: 20 }}>
                <span className="thinking-dots"><span /><span /><span /></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div style={{
        flexShrink: 0, padding: '8px 12px calc(92px + var(--safe-bottom))',
        background: 'linear-gradient(to top, var(--bg-primary) 80%, transparent)',
      }}>
        <div className="status-bar" style={{ marginBottom: 6 }}>
          <span className="status-item">
            <span className="status-dot" />
            {status.zh}
          </span>
        </div>

        {(selectedImage || selectedFile) && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6, gap: 8 }}>
            {selectedImage && (
              <div className="jelly-card" style={{ padding: '6px 8px 6px 6px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <img src={selectedImage.dataUrl} style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
                <span>{selectedImage.name}</span>
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

        {pokeAction && pokePart && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
            <div className="poke-system-msg" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', fontSize: 13 }}>
              <Icon name="finger" size={14} color="var(--accent)" />
              <span>{userName}{pokeAction}{aiName}的{pokePart}</span>
              <button onClick={() => { setPokeAction(null); setPokePart(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                <Icon name="x" size={14} />
              </button>
            </div>
          </div>
        )}

        <div style={{ position: 'relative' }}>
          {showPlusMenu && (
            <div className="plus-menu" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => imageInputRef.current?.click()} className="plus-menu-item">
                <Icon name="image" size={18} color="var(--accent)" />
                <span>添加图片</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="plus-menu-item">
                <Icon name="file" size={18} color="var(--accent)" />
                <span>添加文件</span>
              </button>
              <button onClick={() => { setShowPokePanel(true); setShowPlusMenu(false); }} className="plus-menu-item">
                <Icon name="finger" size={18} color="var(--accent)" />
                <span>戳一戳</span>
              </button>
            </div>
          )}

          <div className="jelly-card" style={{ display: 'flex', alignItems: 'flex-end', gap: 6, padding: 6 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowPlusMenu(!showPlusMenu)} className="jelly-button" style={{ width: 38, height: 38 }}>
                <Icon name="plus" />
              </button>
              <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageSelect} />
              <input ref={fileInputRef} type="file" accept=".docx,.txt,.pdf,.html,.htm,.md,.csv,.json,.js,.css" style={{ display: 'none' }} onChange={handleFileSelect} />
            </div>
            <textarea
              value={inputText} onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown} placeholder="说点什么..." rows={1}
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

      {previewImage && (
        <div className="modal-overlay" onClick={() => setPreviewImage(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={previewImage} style={{ maxWidth: '92%', maxHeight: '88%', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} />
        </div>
      )}

      {previewFile && <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />}

      {thinkingId && (
        <div className="modal-overlay" onClick={() => setThinkingId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14, marginTop: 8 }}>Thought process</h3>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              {messages.find(m => m.id === thinkingId)?.thinking}
            </p>
            <button onClick={() => setThinkingId(null)} className="jelly-button jelly-button-accent" style={{ width: '100%', height: 44, marginTop: 18, borderRadius: 22, fontSize: 15 }}>
              知道了
            </button>
          </div>
        </div>
      )}

      {showPokePanel && (
        <div className="modal-overlay" onClick={() => setShowPokePanel(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 18, marginTop: 8 }}>戳一戳</h3>
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
            <button onClick={confirmPoke} className="jelly-button jelly-button-accent" style={{ width: '100%', height: 48, borderRadius: 24, fontSize: 15, fontWeight: 600 }}>
              就这一下
            </button>
          </div>
        </div>
      )}

      {showModelPicker && (
        <div className="modal-overlay" onClick={() => setShowModelPicker(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 16, marginTop: 8 }}>选择模型</h3>
            {MODELS.map(model => (
              <div key={model.id} onClick={() => { setSelectedModel(model); setShowModelPicker(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, cursor: 'pointer', marginBottom: 6,
                background: selectedModel.id === model.id ? 'var(--accent-lighter)' : 'transparent',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
