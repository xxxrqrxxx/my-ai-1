import React, { useState, useEffect } from 'react';
import { getLetters, createLetter } from '../api';

const Icon = ({ name, size = 20, color = 'var(--text-secondary)' }) => {
  switch(name) {
    case 'back':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
    case 'edit':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
    case 'mail':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    case 'chevron-down':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
    default: return null;
  }
};

const formatTime = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
};

export default function LetterView({ onBack }) {
  const [letters, setLetters] = useState([]);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState({ title: '', greeting: '亲爱的 Arden：', content: '', closing: 'Nana' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = async () => {
    try {
      const data = await getLetters();
      const formatted = (data || []).map(l => ({
        id: l.id,
        author: l.author,
        title: l.title,
        greeting: l.greeting,
        content: l.content,
        closing: l.closing,
        time: formatTime(l.created_at)
      }));
      setLetters(formatted);
    } catch (e) {
      console.error('加载信件失败:', e);
    }
  };

  const handleWrite = async () => {
    if (!form.content.trim()) return;
    setLoading(true);
    try {
      const newLetter = await createLetter({
        author: 'nana',
        title: form.title.trim() || '无题',
        greeting: form.greeting.trim() || '亲爱的 Arden：',
        content: form.content.trim(),
        closing: form.closing.trim() || 'Nana'
      });
      const formatted = {
        id: newLetter.id,
        author: newLetter.author,
        title: newLetter.title,
        greeting: newLetter.greeting,
        content: newLetter.content,
        closing: newLetter.closing,
        time: formatTime(newLetter.created_at)
      };
      setLetters([formatted, ...letters]);
      setForm({ title: '', greeting: '亲爱的 Arden：', content: '', closing: 'Nana' });
      setShowWriteModal(false);
    } catch (e) {
      console.error('写信失败:', e);
      alert('寄出失败');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="page-container">
      {/* 顶部导航 */}
      <div className="glass-header" style={{ position: 'relative', zIndex: 50, flexShrink: 0, paddingTop: 'env(safe-area-inset-top)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
          <button onClick={onBack} className="jelly-button" style={{ width: 40, height: 40 }}>
            <Icon name="back" />
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', flex: 1, textAlign: 'center' }}>写信</h2>
          <button onClick={() => setShowWriteModal(true)} className="jelly-button jelly-button-accent" style={{ width: 40, height: 40 }}>
            <Icon name="edit" size={18} color="white" />
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 100px' }}>
        {letters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <Icon name="mail" size={48} color="var(--accent-lighter)" />
            <div style={{ marginTop: 16, fontSize: 14 }}>还没有信件</div>
            <div style={{ marginTop: 4, fontSize: 12 }}>写一封信吧，有些话适合慢慢说</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {letters.map(letter => {
              const isExpanded = expandedId === letter.id;
              const preview = letter.content.length > 80 && !isExpanded
                ? letter.content.slice(0, 80) + '...'
                : letter.content;

              return (
                <div key={letter.id} onClick={() => toggleExpand(letter.id)} style={{
                  background: 'linear-gradient(180deg, #FFFAFC 0%, #FFF5F8 100%)',
                  borderRadius: 16,
                  padding: '20px 30px 16px 34px',
                  boxShadow: '0 4px 20px rgba(244,181,197,0.15)',
                  border: '1px solid rgba(244,181,197,0.2)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* 信纸左侧装订线 */}
                  <div style={{
                    position: 'absolute', left: 16, top: 16, bottom: 16, width: 2,
                    background: 'linear-gradient(180deg, var(--accent), var(--accent-lighter))',
                    borderRadius: 1, opacity: 0.4,
                  }} />

                  {/* 作者标签和日期 */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 10,
                      background: letter.author === 'arden' ? 'var(--accent-lighter)' : 'rgba(255,255,255,0.8)',
                      color: letter.author === 'arden' ? 'var(--accent)' : 'var(--text-secondary)',
                    }}>
                      {letter.author === 'arden' ? 'Arden 的信' : '我的信'}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{letter.time}</span>
                  </div>

                  {/* 标题 */}
                  {letter.title && (
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, textAlign: 'center' }}>
                      {letter.title}
                    </div>
                  )}

                  {/* 称呼 */}
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
                    {letter.greeting}
                  </div>

                  {/* 正文 - 带横线纹理 */}
                  <div style={{
                    fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(244,181,197,0.15) 27px, rgba(244,181,197,0.15) 28px)',
                    paddingBottom: 4,
                  }}>
                    {preview}
                  </div>

                  {/* 展开提示 */}
                  {letter.content.length > 80 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 10, color: 'var(--accent)', fontSize: 12 }}>
                      {isExpanded ? '收起' : '展开全文'}
                      <Icon name="chevron-down" size={14} color="var(--accent)" />
                    </div>
                  )}

                  {/* 署名 */}
                  <div style={{ marginTop: 16, textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontStyle: 'italic' }}>
                      {letter.closing}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 写信弹窗 - 固定90vh */}
      {showWriteModal && (
        <div className="modal-overlay" onClick={() => setShowWriteModal(false)} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 2000 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ height: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
                <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--text-muted)', opacity: 0.3 }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 16 }}>写一封信</h3>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              {/* 标题 */}
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                placeholder="信件标题（可选）"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 14,
                  border: '1.5px solid var(--accent-lighter)',
                  background: 'rgba(255,255,255,0.7)',
                  color: 'var(--text-primary)', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box', marginBottom: 10,
                  fontFamily: 'inherit',
                }}
              />
              {/* 称呼 */}
              <input
                type="text"
                value={form.greeting}
                onChange={e => setForm({...form, greeting: e.target.value})}
                placeholder="称呼"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 14,
                  border: '1.5px solid var(--accent-lighter)',
                  background: 'rgba(255,255,255,0.7)',
                  color: 'var(--text-primary)', fontSize: 14, fontWeight: 600,
                  outline: 'none', boxSizing: 'border-box', marginBottom: 10,
                  fontFamily: 'inherit',
                }}
              />
              {/* 正文 */}
              <textarea
                value={form.content}
                onChange={e => setForm({...form, content: e.target.value})}
                placeholder="写下你想说的话..."
                rows={8}
                style={{
                  width: '100%', padding: 14, borderRadius: 14,
                  border: '1.5px solid var(--accent-lighter)',
                  background: 'rgba(255,255,255,0.7)',
                  color: 'var(--text-primary)', fontSize: 14,
                  outline: 'none', resize: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit', lineHeight: 1.8, marginBottom: 10,
                }}
              />
              {/* 署名 */}
              <input
                type="text"
                value={form.closing}
                onChange={e => setForm({...form, closing: e.target.value})}
                placeholder="署名"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 14,
                  border: '1.5px solid var(--accent-lighter)',
                  background: 'rgba(255,255,255,0.7)',
                  color: 'var(--text-primary)', fontSize: 14, fontStyle: 'italic',
                  outline: 'none', boxSizing: 'border-box', marginBottom: 16,
                  fontFamily: 'inherit', textAlign: 'right',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <button onClick={() => setShowWriteModal(false)} className="jelly-button" style={{ flex: 1, height: 48, borderRadius: 24, fontSize: 15 }}>取消</button>
              <button onClick={handleWrite} disabled={loading} className="jelly-button jelly-button-accent" style={{ flex: 1, height: 48, borderRadius: 24, fontSize: 15, fontWeight: 600 }}>{loading ? '寄出中...' : '寄出'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
