import React, { useState } from 'react';
import { mockMemories, MEMORY_CATEGORIES } from '../mockData';

const Icon = ({ name, size = 18, color = 'var(--text-secondary)' }) => {
  const sw = 1.8;
  switch(name) {
    case 'search':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case 'plus':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case 'edit':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
    case 'trash':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
    case 'settings':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case 'x':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    case 'tag':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
    case 'check':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
    default: return null;
  }
};

export default function MemoryView() {
  const [memories, setMemories] = useState(mockMemories);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState(MEMORY_CATEGORIES[0]);
  const [compressThreshold, setCompressThreshold] = useState(6000);
  const [keepRounds, setKeepRounds] = useState(6);
  
  // 自定义标签
  const [customTags, setCustomTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState(null);
  const [editingTagName, setEditingTagName] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(null);

  // 所有标签 = 系统标签 + 自定义标签
  const allTags = [...MEMORY_CATEGORIES, ...customTags];
  const categories = ['全部', ...allTags];
  
  const filteredMemories = memories.filter(m => {
    const matchSearch = m.title.includes(searchQuery) || m.content.includes(searchQuery);
    const matchCategory = activeCategory === '全部' || m.category === activeCategory;
    return matchSearch && matchCategory;
  });

  // 空标签
  const emptyTags = allTags.filter(tag => !memories.some(m => m.category === tag));

  const handleAdd = () => {
    setEditingMemory(null);
    setNewTitle('');
    setNewContent('');
    setNewCategory(allTags[0]);
    setShowAddModal(true);
  };

  const handleEdit = (memory) => {
    setEditingMemory(memory);
    setNewTitle(memory.title);
    setNewContent(memory.content);
    setNewCategory(memory.category);
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!newTitle.trim()) return;
    if (editingMemory) {
      setMemories(prev => prev.map(m => 
        m.id === editingMemory.id 
          ? { ...m, title: newTitle, content: newContent, category: newCategory }
          : m
      ));
    } else {
      setMemories(prev => [{
        id: Date.now(),
        title: newTitle,
        content: newContent,
        category: newCategory,
        source: 'user',
        model: null,
        time: new Date().toISOString().split('T')[0],
        // 后端记忆库预留字段
        importance: 3,
        keywords: [],
        emotional_valence: 'neutral',
        pulse: 1.0,
      }, ...prev]);
    }
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  // 添加标签
  const handleAddTag = () => {
    if (newTagName.trim() && !allTags.includes(newTagName.trim())) {
      setCustomTags(prev => [...prev, newTagName.trim()]);
    }
    setNewTagName('');
    setShowAddTag(false);
  };

  // 系统标签重命名映射（因为 MEMORY_CATEGORIES 是常量不能改，用这个来覆盖显示）
  const [renamedSystemTags, setRenamedSystemTags] = useState({});

  // 重命名标签（所有标签都能改）
  const handleRenameTag = (oldName, newName) => {
    if (!newName.trim() || newName.trim() === oldName) return;
    if (allTags.includes(newName.trim())) return;
    
    if (MEMORY_CATEGORIES.includes(oldName)) {
      setMemories(prev => prev.map(m => m.category === oldName ? { ...m, category: newName.trim() } : m));
      setCustomTags(prev => [...prev, newName.trim()]);
      setRenamedSystemTags(prev => ({ ...prev, [oldName]: newName.trim() }));
    } else {
      setCustomTags(prev => prev.map(t => t === oldName ? newName.trim() : t));
      setMemories(prev => prev.map(m => m.category === oldName ? { ...m, category: newName.trim() } : m));
    }
    if (activeCategory === oldName) setActiveCategory(newName.trim());
    if (newCategory === oldName) setNewCategory(newName.trim());
  };

  // 实际显示的标签名（考虑重命名）
  const displayTagName = (tag) => renamedSystemTags[tag] || tag;

  // 实际可用的标签列表（考虑重命名后的系统标签）
  const effectiveTags = allTags.map(t => renamedSystemTags[t] || t);

  // 已删除的系统标签
  const [deletedSystemTags, setDeletedSystemTags] = useState([]);

  // 删除标签（所有标签都能删，删除后记忆移到第一个标签）
  const handleDeleteTag = (tagName) => {
    const originalName = Object.keys(renamedSystemTags).find(k => renamedSystemTags[k] === tagName) || tagName;
    const defaultTag = effectiveTags.find(t => t !== tagName) || '未分类';
    
    setMemories(prev => prev.map(m => {
      const cat = renamedSystemTags[m.category] || m.category;
      return cat === tagName ? { ...m, category: defaultTag } : m;
    }));
    
    if (MEMORY_CATEGORIES.includes(originalName)) {
      setDeletedSystemTags(prev => [...prev, originalName]);
    } else {
      setCustomTags(prev => prev.filter(t => t !== originalName));
    }
    
    if (activeCategory === tagName) setActiveCategory('全部');
    if (newCategory === tagName) setNewCategory(defaultTag);
  };

  // 最终显示的标签列表（排除已删除的系统标签）
  const visibleTags = allTags.filter(t => !deletedSystemTags.includes(t)).map(t => renamedSystemTags[t] || t);
  const visibleCategories = ['全部', ...visibleTags];

  // 改记忆分类
  const handleChangeCategory = (memoryId, newCat) => {
    setMemories(prev => prev.map(m => m.id === memoryId ? { ...m, category: newCat } : m));
    setShowCategoryPicker(null);
  };

  // 一键删空标签
  const handleDeleteEmptyTags = () => {
    emptyTags.forEach(tag => handleDeleteTag(tag));
  };

  const startEditTag = (tag) => {
    setEditingTag(tag);
    setEditingTagName(tag);
  };

  const saveEditTag = () => {
    if (editingTag) {
      handleRenameTag(editingTag, editingTagName);
    }
    setEditingTag(null);
    setEditingTagName('');
  };

  return (
    <div className="page-container">
      <div className="page-content" style={{ padding: '50px 16px 100px' }}>
        {/* 标题 */}
        <div style={{ marginBottom: 18, textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            Memory
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Arden 记得关于你的一切
          </p>
        </div>

        {/* 搜索框 + 记忆设置按钮 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <div className="jelly-card" style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px',
          }}>
            <Icon name="search" size={16} />
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
          <button onClick={() => setShowSettingsModal(true)} className="jelly-button" style={{ width: 42, height: 42 }}>
            <Icon name="settings" size={18} />
          </button>
        </div>

        {/* 分类标签 */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4, alignItems: 'center' }}>
          {visibleCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: 16,
                border: 'none',
                fontSize: 13,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                background: activeCategory === cat ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                fontWeight: activeCategory === cat ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
          
          {/* 添加标签按钮 */}
          <button
            onClick={() => setShowAddTag(true)}
            className="jelly-button"
            style={{
              flexShrink: 0, width: 32, height: 32, borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 0, background: 'var(--glass-bg)',
            }}
            title="添加标签"
          >
            <Icon name="plus" size={16} color="var(--accent)" />
          </button>
          
          {/* 标签管理按钮 */}
          <button
            onClick={() => setShowTagManager(true)}
            className="jelly-button"
            style={{
              flexShrink: 0, width: 32, height: 32, borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 0, background: 'var(--glass-bg)',
            }}
            title="管理标签"
          >
            <Icon name="tag" size={15} color="var(--accent)" />
          </button>
        </div>

        {/* 记忆列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredMemories.map(memory => (
            <div key={memory.id} className="jelly-card" style={{ padding: 14, position: 'relative' }}>
              <div style={{ paddingRight: 60 }}>
                {/* 标签移到小标题前面，标签可点击改分类 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <button
                    onClick={() => setShowCategoryPicker(showCategoryPicker === memory.id ? null : memory.id)}
                    className="tag"
                    style={{ 
                      fontSize: 11, cursor: 'pointer', border: 'none',
                      background: 'var(--accent-lighter)', color: 'var(--text-secondary)',
                    }}
                    title="点击修改分类"
                  >
                    {displayTagName(memory.category)}
                  </button>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {memory.title}
                  </h3>
                </div>

                {/* 分类选择器 */}
                {showCategoryPicker === memory.id && (
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 6,
                    marginBottom: 10, padding: '8px 10px',
                    background: 'var(--glass-bg-strong)', borderRadius: 12,
                  }}>
                    {visibleTags.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleChangeCategory(memory.id, cat)}
                        style={{
                          padding: '4px 10px', borderRadius: 12, border: 'none',
                          fontSize: 12, cursor: 'pointer',
                          background: displayTagName(memory.category) === cat ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                          color: displayTagName(memory.category) === cat ? 'white' : 'var(--text-secondary)',
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}
                      >
                        {cat}
                        {displayTagName(memory.category) === cat && <Icon name="check" size={10} color="white" />}
                      </button>
                    ))}
                  </div>
                )}

                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                  {memory.content}
                </p>
                <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                  <span>{memory.source === 'auto' ? '自动记录' : '手动添加'}</span>
                  <span>·</span>
                  <span>{memory.time}</span>
                  {memory.model && <><span>·</span><span>{memory.model}</span></>}
                </div>
              </div>
              {/* 右下角操作按钮 */}
              <div style={{
                position: 'absolute', right: 10, bottom: 10,
                display: 'flex', gap: 6,
              }}>
                <button onClick={() => handleEdit(memory)} className="jelly-button" style={{ width: 30, height: 30 }}>
                  <Icon name="edit" size={14} />
                </button>
                <button onClick={() => handleDelete(memory.id)} className="jelly-button" style={{ width: 30, height: 30 }}>
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 悬浮添加按钮 */}
        <button
          onClick={handleAdd}
          className="jelly-button jelly-button-accent"
          style={{
            position: 'absolute', right: 20, bottom: 'calc(100px + var(--safe-bottom))',
            width: 52, height: 52, borderRadius: 26,
            boxShadow: 'var(--shadow-accent)',
          }}
        >
          <Icon name="plus" size={22} color="white" />
        </button>
      </div>

      {/* 新建/编辑记忆弹窗 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, marginTop: 8 }}>
              {editingMemory ? '编辑记忆' : '新建记忆'}
            </h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>标题</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="记忆标题"
                className="jelly-input"
                style={{ width: '100%', padding: '10px 14px', fontSize: 14 }}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>内容</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="记忆内容..."
                rows={4}
                className="jelly-input"
                style={{ width: '100%', padding: '10px 14px', fontSize: 14, resize: 'none' }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>分类</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {visibleTags.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setNewCategory(cat)}
                    style={{
                      padding: '6px 12px', borderRadius: 14, border: 'none',
                      fontSize: 12, cursor: 'pointer',
                      background: newCategory === cat ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                      color: newCategory === cat ? 'white' : 'var(--text-secondary)',
                    }}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  onClick={() => setShowAddTag(true)}
                  style={{
                    padding: '6px 12px', borderRadius: 14, 
                    border: '1px dashed var(--text-muted)',
                    background: 'transparent',
                    fontSize: 12, cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <Icon name="plus" size={12} /> 新标签
                </button>
              </div>
            </div>
            <button onClick={handleSave} className="jelly-button jelly-button-accent" style={{
              width: '100%', height: 46, borderRadius: 23, fontSize: 15, fontWeight: 600,
            }}>
              保存
            </button>
          </div>
        </div>
      )}

      {/* 记忆设置弹窗 */}
      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 18, marginTop: 8 }}>
              记忆设置
            </h3>
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>压缩阈值</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{compressThreshold} tokens</span>
              </div>
              <input
                type="range" min={2000} max={20000} step={500}
                value={compressThreshold}
                onChange={(e) => setCompressThreshold(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                对话超过这个长度时自动压缩摘要
              </p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>保留轮数</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{keepRounds} 轮</span>
              </div>
              <input
                type="range" min={2} max={20} step={1}
                value={keepRounds}
                onChange={(e) => setKeepRounds(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                压缩时保留最近多少轮对话不被压缩
              </p>
            </div>
            <button onClick={() => setShowSettingsModal(false)} className="jelly-button jelly-button-accent" style={{
              width: '100%', height: 46, borderRadius: 23, fontSize: 15, fontWeight: 600,
            }}>
              确定
            </button>
          </div>
        </div>
      )}

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
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
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

      {/* 标签管理弹窗 */}
      {showTagManager && (
        <div className="modal-overlay modal-center" onClick={() => { setShowTagManager(false); setEditingTag(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>
                管理标签
              </h3>
              <button onClick={() => { setShowTagManager(false); setEditingTag(null); }} className="jelly-button" style={{ width: 30, height: 30 }}>
                <Icon name="x" size={16} />
              </button>
            </div>
            
            <div style={{ marginBottom: 12, fontSize: 12, color: 'var(--text-muted)' }}>
              所有标签都可以重命名或删除。删除标签后，该标签下的记忆会移到第一个标签。
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '50vh', overflowY: 'auto' }}>
              {visibleTags.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>
                  还没有标签
                </div>
              ) : (
                visibleTags.map(tag => {
                  const count = memories.filter(m => (renamedSystemTags[m.category] || m.category) === tag).length;
                  const isEditing = editingTag === tag;
                  return (
                    <div key={tag} className="jelly-card" style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 12px',
                    }}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingTagName}
                          onChange={(e) => setEditingTagName(e.target.value)}
                          className="jelly-input"
                          style={{ flex: 1, fontSize: 13 }}
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && saveEditTag()}
                        />
                      ) : (
                        <span style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>
                          {tag}
                          <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                            {count} 条记忆
                          </span>
                        </span>
                      )}
                      
                      {isEditing ? (
                        <button onClick={saveEditTag} className="jelly-button jelly-button-accent" style={{ width: 30, height: 30, borderRadius: 15 }}>
                          <Icon name="check" size={14} color="white" />
                        </button>
                      ) : (
                        <button onClick={() => startEditTag(tag)} className="jelly-button" style={{ width: 30, height: 30, borderRadius: 15 }}>
                          <Icon name="edit" size={14} color="var(--accent)" />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => {
                          if (confirm(`删除标签"${tag}"？该标签下的 ${count} 条记忆将移到第一个标签。`)) {
                            handleDeleteTag(tag);
                          }
                        }}
                        className="jelly-button" 
                        style={{ width: 30, height: 30, borderRadius: 15 }}
                      >
                        <Icon name="trash" size={14} color="#E87070" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {emptyTags.length > 0 && (
              <button 
                onClick={handleDeleteEmptyTags}
                style={{
                  marginTop: 14, width: '100%', padding: '10px',
                  border: '1px dashed #E87070', background: 'transparent',
                  borderRadius: 12, color: '#E87070', fontSize: 13, cursor: 'pointer',
                }}
              >
                一键删除 {emptyTags.length} 个空标签
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
