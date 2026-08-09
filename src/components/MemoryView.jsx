import React, { useState } from 'react';
import { mockMemories, MEMORY_CATEGORIES } from '../mockData';

const Icon = ({ name, size = 20, color = 'var(--text-secondary)' }) => {
  const sw = 1.8;
  switch(name) {
    case 'plus':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case 'search':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case 'x':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    case 'edit':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
    case 'trash':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
    case 'minus':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    default: return null;
  }
};

export default function MemoryView() {
  const [memories, setMemories] = useState(mockMemories);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [customTags, setCustomTags] = useState([]);
  const [editingMemory, setEditingMemory] = useState(null);
  const [newMemory, setNewMemory] = useState({ title: '', content: '', category: '日常' });

  const allCategories = ['全部', ...MEMORY_CATEGORIES, ...customTags];
  
  const filtered = memories.filter(m => {
    const matchCat = activeCategory === '全部' || m.category === activeCategory;
    const matchSearch = !searchQuery || 
      m.title.includes(searchQuery) || 
      m.content.includes(searchQuery);
    return matchCat && matchSearch;
  });

  // 找出没有记忆的空标签
  const emptyTags = customTags.filter(tag => !memories.some(m => m.category === tag));

  const handleSave = () => {
    if (!newMemory.title.trim() || !newMemory.content.trim()) return;
    if (editingMemory) {
      setMemories(prev => prev.map(m => m.id === editingMemory.id ? {
        ...m,
        title: newMemory.title,
        content: newMemory.content,
        category: newMemory.category,
      } : m));
    } else {
      setMemories(prev => [{
        id: Date.now(),
        title: newMemory.title,
        content: newMemory.content,
        category: newMemory.category,
        source: 'user',
        model: null,
        time: new Date().toISOString().split('T')[0],
      }, ...prev]);
    }
    setNewMemory({ title: '', content: '', category: '日常' });
    setShowNewForm(false);
    setEditingMemory(null);
  };

  const handleAddTag = () => {
    if (newTagName.trim() && !allCategories.includes(newTagName.trim())) {
      setCustomTags(prev => [...prev, newTagName.trim()]);
    }
    setNewTagName('');
    setShowAddTag(false);
  };

  const handleDeleteEmptyTags = () => {
    setCustomTags(prev => prev.filter(tag => memories.some(m => m.category === tag)));
  };

  const handleEdit = (memory) => {
    setEditingMemory(memory);
    setNewMemory({ title: memory.title, content: memory.content, category: memory.category });
    setShowNewForm(true);
  };

  const handleDelete = (id) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="page-container">
      <div className="page-content" style={{ padding: '50px 16px 100px' }}>
        <div style={{ marginBottom: 18, textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            Memory
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Arden 记得关于你的一切</p>
        </div>

        <div className="jelly-card" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', marginBottom: 14,
        }}>
          <Icon name="search" size={18} />
          <input
            type="text"
            placeholder="搜索记忆..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1, border: 'none', background: 'transparent',
              fontSize: 14, color: 'var(--text-primary)', outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4, alignItems: 'center' }}>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: 16,
                border: 'none',
                fontSize: 13,
                cursor: 'pointer',
                background: activeCategory === cat ? 'var(--bg-accent)' : 'var(--glass-bg)',
                color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowAddTag(true)}
            style={{
              flexShrink: 0, width: 28, height: 28, borderRadius: 14,
              border: '1px dashed var(--text-muted)', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-muted)',
            }}
          >
            <Icon name="plus" size={14} color="var(--text-muted)" />
          </button>
          {emptyTags.length > 0 && (
            <button
              onClick={handleDeleteEmptyTags}
              style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: 14,
                border: '1px dashed #E87070', background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#E87070',
              }}
              title="删除空标签"
            >
              <Icon name="minus" size={14} color="#E87070" />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(mem => (
            <div key={mem.id} className="jelly-card" style={{ padding: 16, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, paddingRight: 70 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
                  {mem.title}
                </h3>
                <span className="tag">{mem.category}</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 8, paddingRight: 70 }}>
                {mem.content}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                <span>{mem.time}</span>
                {mem.source === 'auto' && mem.model && (
                  <>
                    <span>·</span>
                    <span>由 {mem.model} 自动压缩</span>
                  </>
                )}
              </div>
              {/* 右下角两个圆形按钮 */}
              <div style={{ position: 'absolute', right: 12, bottom: 12, display: 'flex', gap: 6 }}>
                <button
                  onClick={() => handleEdit(mem)}
                  className="jelly-button"
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                >
                  <Icon name="edit" size={14} color="var(--bg-accent)" />
                </button>
                <button
                  onClick={() => handleDelete(mem.id)}
                  className="jelly-button"
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                >
                  <Icon name="trash" size={14} color="#E87070" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => { setEditingMemory(null); setNewMemory({ title: '', content: '', category: '日常' }); setShowNewForm(true); }}
          className="jelly-button jelly-button-accent"
          style={{
            position: 'fixed',
            bottom: 'calc(90px + var(--safe-bottom))',
            right: 20,
            width: 52, height: 52,
            borderRadius: 26,
            boxShadow: '0 6px 20px rgba(232, 145, 181, 0.4)',
          }}
        >
          <Icon name="plus" size={24} color="white" />
        </button>

        {/* 添加标签弹窗 */}
        {showAddTag && (
          <div className="modal-overlay modal-center" onClick={() => setShowAddTag(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
                添加标签
              </h3>
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="标签名称"
                className="jelly-input"
                style={{ marginBottom: 14 }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowAddTag(false)} className="jelly-button" style={{
                  flex: 1, height: 42, borderRadius: 21, fontSize: 14,
                }}>
                  取消
                </button>
                <button onClick={handleAddTag} className="jelly-button jelly-button-accent" style={{
                  flex: 1, height: 42, borderRadius: 21, fontSize: 14,
                }}>
                  添加
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 新建/编辑记忆弹窗 */}
        {showNewForm && (
          <div className="modal-overlay" onClick={() => { setShowNewForm(false); setEditingMemory(null); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {editingMemory ? '修改记忆' : '新建记忆'}
                </h3>
                <button onClick={() => { setShowNewForm(false); setEditingMemory(null); }} className="jelly-button" style={{ width: 32, height: 32 }}>
                  <Icon name="x" size={18} />
                </button>
              </div>
              
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>标题</label>
                <input
                  type="text"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                  placeholder="记忆标题"
                  className="jelly-input"
                />
              </div>
              
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>内容</label>
                <textarea
                  value={newMemory.content}
                  onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                  placeholder="要记住什么..."
                  rows={4}
                  style={{
                    width: '100%', border: '1px solid var(--border-color)', borderRadius: 12,
                    padding: 12, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6,
                    background: 'var(--bg-input)', resize: 'none', outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>标签</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {allCategories.filter(c => c !== '全部').map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewMemory({ ...newMemory, category: cat })}
                      style={{
                        padding: '5px 12px', borderRadius: 14, border: 'none', fontSize: 12, cursor: 'pointer',
                        background: newMemory.category === cat ? 'var(--bg-accent)' : 'var(--glass-bg)',
                        color: newMemory.category === cat ? 'white' : 'var(--text-secondary)',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              
              <button onClick={handleSave} className="jelly-button jelly-button-accent" style={{
                width: '100%', height: 46, borderRadius: 23, fontSize: 15, fontWeight: 600,
              }}>
                {editingMemory ? '保存修改' : '保存'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}