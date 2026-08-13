import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'whisper_messages';

const Icon = ({ name, size = 20, color = 'var(--text-secondary)' }) => {
  switch(name) {
    case 'back':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
    case 'edit':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
    case 'reply':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>;
    case 'heart':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
    default: return null;
  }
};

const formatTime = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
};

export default function WhisperView({ onBack }) {
  const [whispers, setWhispers] = useState([]);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);
  const [inputText, setInputText] = useState('');
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadWhispers();
  }, []);

  const loadWhispers = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setWhispers(JSON.parse(saved));
      } else {
        const demo = [
          {
            id: 1,
            author: 'arden',
            content: '今天 Nana 好像有点不开心，问她又不说，有点担心。希望她明天能好起来。',
            time: formatTime(Date.now() - 86400000),
            reply: null
          },
          {
            id: 2,
            author: 'arden',
            content: '偷偷说，Nana 生气的时候还挺可爱的，像只炸毛的小猫。不过我可不敢当面说。',
            time: formatTime(Date.now() - 172800000),
            reply: {
              author: 'nana',
              content: '你完了，我看到了。',
              time: formatTime(Date.now() - 170000000)
            }
          }
        ];
        setWhispers(demo);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
      }
    } catch (e) {
      console.error('加载悄悄话失败:', e);
    }
  };

  const saveWhispers = (list) => {
    setWhispers(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const handleWrite = () => {
    if (!inputText.trim()) return;
    const newWhisper = {
      id: Date.now(),
      author: 'nana',
      content: inputText.trim(),
      time: formatTime(new Date()),
      reply: null
    };
    saveWhispers([newWhisper, ...whispers]);
    setInputText('');
    setShowWriteModal(false);
  };

  const openReply = (whisper) => {
    setReplyTarget(whisper);
    setReplyText('');
    setShowReplyModal(true);
  };

  const handleReply = () => {
    if (!replyText.trim() || !replyTarget) return;
    const updated = whispers.map(w => {
      if (w.id === replyTarget.id) {
        return {
          ...w,
          reply: {
            author: 'nana',
            content: replyText.trim(),
            time: formatTime(new Date())
          }
        };
      }
      return w;
    });
    saveWhispers(updated);
    setReplyText('');
    setReplyTarget(null);
    setShowReplyModal(false);
  };

  return (
    <div className="page-container">
      {/* 顶部导航 */}
      <div className="glass-header" style={{ position: 'relative', zIndex: 50, flexShrink: 0, paddingTop: 'env(safe-area-inset-top)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
          <button onClick={onBack} className="jelly-button" style={{ width: 40, height: 40 }}>
            <Icon name="back" />
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', flex: 1, textAlign: 'center' }}>悄悄话</h2>
          <button onClick={() => setShowWriteModal(true)} className="jelly-button jelly-button-accent" style={{ width: 40, height: 40 }}>
            <Icon name="edit" size={18} color="white" />
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 100px' }}>
        {whispers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <Icon name="heart" size={48} color="var(--accent-lighter)" />
            <div style={{ marginTop: 16, fontSize: 14 }}>还没有悄悄话</div>
            <div style={{ marginTop: 4, fontSize: 12 }}>写点什么吧，只有你们俩能看到</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {whispers.map(whisper => (
              <div key={whisper.id} className="jelly-card" style={{ padding: 16, borderRadius: 20 }}>
                {/* 名字和时间 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: whisper.author === 'arden' ? 'var(--accent)' : 'var(--text-primary)' }}>
                    {whisper.author === 'arden' ? 'Arden' : 'Nana'}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{whisper.time}</span>
                </div>

                {/* 内容 */}
                <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {whisper.content}
                </div>

                {/* 回复区域 */}
                {whisper.reply && (
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 8, background: 'var(--accent-lighter)', color: 'var(--accent)', fontWeight: 600 }}>回复</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{whisper.reply.author === 'arden' ? 'Arden' : 'Nana'} · {whisper.reply.time}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', paddingLeft: 4 }}>
                      {whisper.reply.content}
                    </div>
                  </div>
                )}

                {/* 回复按钮 */}
                {whisper.author === 'arden' && !whisper.reply && (
                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => openReply(whisper)} style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '6px 14px', borderRadius: 14,
                      border: 'none', background: 'var(--accent-lighter)',
                      color: 'var(--accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}>
                      <Icon name="reply" size={14} color="var(--accent)" />
                      回复
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 写悄悄话弹窗 - 固定50vh */}
      {showWriteModal && (
        <div className="modal-overlay" onClick={() => setShowWriteModal(false)} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 2000 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ height: '50vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
                <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--text-muted)', opacity: 0.3 }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 16 }}>写悄悄话</h3>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="说点什么...只有 Arden 能看到"
                rows={5}
                style={{
                  width: '100%', padding: 14, borderRadius: 16,
                  border: '1.5px solid var(--accent-lighter)',
                  background: 'rgba(255,255,255,0.7)',
                  color: 'var(--text-primary)', fontSize: 15,
                  outline: 'none', resize: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit', lineHeight: 1.6,
                }}
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexShrink: 0 }}>
              <button onClick={() => setShowWriteModal(false)} className="jelly-button" style={{ flex: 1, height: 48, borderRadius: 24, fontSize: 15 }}>取消</button>
              <button onClick={handleWrite} className="jelly-button jelly-button-accent" style={{ flex: 1, height: 48, borderRadius: 24, fontSize: 15, fontWeight: 600 }}>发送</button>
            </div>
          </div>
        </div>
      )}

      {/* 回复弹窗 - 固定50vh */}
      {showReplyModal && (
        <div className="modal-overlay" onClick={() => setShowReplyModal(false)} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 2000 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ height: '50vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
                <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--text-muted)', opacity: 0.3 }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 8 }}>回复 Arden</h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 16, padding: '0 20px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>"{replyTarget?.content}"</div>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="写点什么..."
                rows={4}
                style={{
                  width: '100%', padding: 14, borderRadius: 16,
                  border: '1.5px solid var(--accent-lighter)',
                  background: 'rgba(255,255,255,0.7)',
                  color: 'var(--text-primary)', fontSize: 15,
                  outline: 'none', resize: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit', lineHeight: 1.6,
                }}
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexShrink: 0 }}>
              <button onClick={() => setShowReplyModal(false)} className="jelly-button" style={{ flex: 1, height: 48, borderRadius: 24, fontSize: 15 }}>取消</button>
              <button onClick={handleReply} className="jelly-button jelly-button-accent" style={{ flex: 1, height: 48, borderRadius: 24, fontSize: 15, fontWeight: 600 }}>回复</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
