import React, { useState, useEffect } from 'react';
import { getMemories, createMemory, updateMemory, deleteMemory } from '../api.js';

function PlusIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function TrashIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// 默认分类标签
const defaultTabs = ["全部", "喜好", "日常", "重要日子"];

export default function MemoryView({ onClose }) {
  const [isExiting, setIsExiting] = useState(false);
  const [tab, setTab] = useState('全部');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 记忆数据（从后端获取）
  const [memories, setMemories] = useState([]);
  const [memoryTabs, setMemoryTabs] = useState(defaultTabs);

  // 弹窗状态
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formText, setFormText] = useState("");
  const [formTag, setFormTag] = useState("喜好");
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");
  const [saving, setSaving] = useState(false);

  // 页面加载时获取记忆列表
  useEffect(() => {
    loadMemories();
  }, []);

  // 从后端加载记忆
  const loadMemories = async () => {
    try {
      setLoading(true);
      const data = await getMemories();
      setMemories(data);

      // 从记忆中提取所有分类，合并到默认分类
      const tagsFromData = [...new Set(data.map(m => m.tag).filter(Boolean))];
      const allTabs = ['全部', ...new Set([...defaultTabs.filter(t => t !== '全部'), ...tagsFromData])];
      setMemoryTabs(allTabs);
    } catch (error) {
      console.error('加载记忆失败:', error);
      alert('加载记忆失败，请检查后端');
    } finally {
      setLoading(false);
    }
  };

  // 关闭页面
  const handleClosePage = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 280);
  };

  // 筛选记忆列表
  const filtered = memories.filter((m) => {
    const matchTab = tab === '全部' || m.tag === tab;
    const matchQuery = !query || (m.title && m.title.includes(query)) || (m.text && m.text.includes(query));
    return matchTab && matchQuery;
  });

  // 打开新增记忆弹窗
  const openAddMemory = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormText("");
    setFormTag(memoryTabs[1] || '日常');
    setShowMemoryModal(true);
  };

  // 打开编辑记忆弹窗
  const openEditMemory = (item) => {
    setEditingItem(item);
    setFormTitle(item.title || "");
    setFormText(item.text || "");
    setFormTag(item.tag || '日常');
    setShowMemoryModal(true);
  };

  // 保存记忆（新增/编辑）
  const saveMemory = async () => {
    if (!formTitle.trim() || !formText.trim()) return;
    if (saving) return;

    setSaving(true);
    try {
      if (editingItem) {
        // 编辑模式
        const updated = await updateMemory(editingItem.id, {
          title: formTitle.trim(),
          text: formText.trim(),
          tag: formTag
        });
        setMemories(prev => prev.map(i => i.id === editingItem.id ? updated : i));
      } else {
        // 新增模式
        const newMem = await createMemory({
          title: formTitle.trim(),
          text: formText.trim(),
          tag: formTag
        });
        setMemories(prev => [newMem, ...prev]);

        // 如果是新分类，添加到标签列表
        if (!memoryTabs.includes(formTag)) {
          setMemoryTabs(prev => [...prev, formTag]);
        }
      }
      setShowMemoryModal(false);
    } catch (error) {
      console.error('保存记忆失败:', error);
      alert('保存失败: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // 删除记忆
  const handleDeleteMemory = async (id) => {
    if (!confirm('确定要删除这条记忆吗？')) return;
    try {
      await deleteMemory(id);
      setMemories(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('删除记忆失败:', error);
      alert('删除失败: ' + error.message);
    }
  };

  // 添加新分类
  const saveNewCategory = () => {
    const val = newCatInput.trim();
    if (!val || memoryTabs.includes(val)) return;
    setMemoryTabs(prev => [...prev, val]);
    setNewCatInput("");
    setShowCatModal(false);
  };

  // 获取来源标签文字
  const getSourceLabel = (item) => {
    if (item.source === 'user') {
      return '✍️ 手动记录';
    } else {
      const modelName = item.model_used || 'AI';
      return `🤖 ${modelName} 自动压缩`;
    }
  };

  // 获取来源标签颜色
  const getSourceColor = (item) => {
    if (item.source === 'user') {
      return { bg: '#E8F5E9', color: '#5A8A5E' };
    } else {
      return { bg: '#E3F2FD', color: '#5A7FA8' };
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FBF2F1 0%, #F7E6EA 48%, #FCEEF2 100%)',
        animation: isExiting ? 'slideOutRight 0.28s ease-in forwards' : 'slideInRight 0.32s ease-out',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ width: '100%', maxWidth: 620, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* 头部 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 20px 16px 20px',
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          <button
            onClick={handleClosePage}
            style={{
              width:48,
              height:48,
              borderRadius:'16px',
              border:'1px solid #E8D2D8',
              backgroundColor:'#ffffff99',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              fontSize:22,
              color:'#6B4854',
              cursor:'pointer'
            }}
          >
            ←
          </button>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#59414A' }}>
            Nana 的记忆
          </span>
          <button
            onClick={openAddMemory}
            style={{
              width:48,
              height:48,
              borderRadius:'16px',
              border:'1px solid #E8D2D8',
              backgroundColor:'#ffffff99',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              fontSize:24,
              color:'#6B4854',
              cursor:'pointer'
            }}
          >
            +
          </button>
        </div>

        {/* 内容滚动区域 */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 20px 24px 20px',
            zIndex: 5,
          }}
        >
          {/* 搜索框 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: 999,
              padding: '14px 20px',
              background: '#FFFDFB',
              boxShadow: '0 2px 10px rgba(140,84,104,0.07)',
              marginBottom: 18,
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索记忆"
              style={{
                background: 'transparent',
                fontSize: 15,
                outline: 'none',
                width: '100%',
                color: '#4A3B3F',
                border: 'none',
              }}
            />
          </div>

          {/* 标签栏 */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
            {memoryTabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  fontSize: 14,
                  padding: '10px 18px',
                  borderRadius: 999,
                  background: tab === t ? '#F6DDE3' : '#FFFDFB',
                  color: tab === t ? '#8C5468' : '#B98A96',
                  fontWeight: tab === t ? 600 : 400,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: tab === t ? '0 1px 4px rgba(140,84,104,0.08)' : 'none',
                }}
              >
                {t}
              </button>
            ))}
            <button
              onClick={() => setShowCatModal(true)}
              style={{
                fontSize: 14,
                padding: '10px 16px',
                borderRadius: 999,
                background: '#FFFDFB',
                color: '#8C5468',
                border: '1px dashed #D8B7BE',
                cursor: 'pointer',
              }}
            >
              +添加分类
            </button>
          </div>

          {/* 加载状态 */}
          {loading && (
            <div style={{ textAlign:'center', fontSize:14, padding:'60px 20px', color:'#C9AAB2' }}>
              加载记忆中...
            </div>
          )}

          {/* 记忆卡片列表 */}
          {!loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filtered.map((m) => {
                const sourceStyle = getSourceColor(m);
                return (
                  <div
                    key={m.id}
                    onClick={() => openEditMemory(m)}
                    style={{
                      borderRadius: 20,
                      padding: '20px 20px',
                      background: '#FFFDFB',
                      boxShadow: '0 2px 10px rgba(140,84,104,0.07)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#E9A9BC' }} />
                        <span style={{ fontSize:16, fontWeight:600, color:'#8C5468' }}>{m.title}</span>
                      </div>
                      <div onClick={(e)=>e.stopPropagation()} style={{ display:'flex', alignItems:'center', gap:18, color:'#D8B7BE' }}>
                        <PencilIcon style={{ width:18, height:18, cursor:'pointer' }} />
                        <TrashIcon onClick={()=>handleDeleteMemory(m.id)} style={{ width:18, height:18, cursor:'pointer' }} />
                      </div>
                    </div>

                    {/* 来源标签 */}
                    <div style={{ marginBottom: 10 }}>
                      <span style={{
                        fontSize: 12,
                        padding: '4px 10px',
                        borderRadius: 999,
                        background: sourceStyle.bg,
                        color: sourceStyle.color,
                        fontWeight: 500,
                      }}>
                        {getSourceLabel(m)}
                      </span>
                    </div>

                    <div style={{ fontSize:15, lineHeight:1.7, color:'#5B4A4E', marginBottom:10 }}>{m.text}</div>
                    <div style={{ fontSize:12, textAlign:'right', color:'#CBAAB1' }}>{m.time}</div>
                  </div>
                );
              })}
              {filtered.length === 0 && !loading && (
                <div style={{ textAlign:'center', fontSize:14, padding:'60px 20px', color:'#C9AAB2' }}>
                  没有找到相关的记忆～
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========== 新增/编辑记忆弹窗 ========== */}
      {showMemoryModal && (
        <div className="modal-mask" onClick={()=>setShowMemoryModal(false)} style={maskStyle}>
          <div onClick={e=>e.stopPropagation()} style={modalBoxStyle}>
            <h3 style={{ margin:0, marginBottom:18, fontSize:17, color:'#4A3B3F' }}>
              {editingItem ? "编辑记忆" : "新增记忆"}
            </h3>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, color:'#8C5468', display:'block', marginBottom:6 }}>标题</label>
              <input
                value={formTitle}
                onChange={e=>setFormTitle(e.target.value)}
                placeholder="输入标题"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, color:'#8C5468', display:'block', marginBottom:6 }}>详情</label>
              <textarea
                value={formText}
                onChange={e=>setFormText(e.target.value)}
                placeholder="填写记忆详情"
                rows={4}
                style={{...inputStyle, resize:'none'}}
              />
            </div>
            <div style={{ marginBottom:22 }}>
              <label style={{ fontSize:13, color:'#8C5468', display:'block', marginBottom:10 }}>选择分类</label>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {memoryTabs.filter(x=>x!=='全部').map(t=>(
                  <label key={t} style={radioLabelStyle}>
                    <input
                      type="radio"
                      name="memTag"
                      value={t}
                      checked={formTag===t}
                      onChange={()=>setFormTag(t)}
                      style={{
                        marginRight: 5,
                        accentColor: "#8C5468"
                      }}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
              <button onClick={()=>setShowMemoryModal(false)} style={btnCancel}>取消</button>
              <button onClick={saveMemory} disabled={saving} style={{...btnPrimary, opacity: saving ? 0.6 : 1}}>
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== 添加分类弹窗 ========== */}
      {showCatModal && (
        <div className="modal-mask" onClick={()=>setShowCatModal(false)} style={maskStyle}>
          <div onClick={e=>e.stopPropagation()} style={modalBoxStyle}>
            <h3 style={{ margin:0, marginBottom:18, fontSize:17, color:'#4A3B3F' }}>添加新分类</h3>
            <input
              value={newCatInput}
              onChange={e=>setNewCatInput(e.target.value)}
              placeholder="输入分类名称"
              style={inputStyle}
            />
            <div style={{ display:'flex', gap:12, justifyContent:'flex-end', marginTop:22 }}>
              <button onClick={()=>setShowCatModal(false)} style={btnCancel}>取消</button>
              <button onClick={saveNewCategory} style={btnPrimary}>确认添加</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes modalFadeIn {
          from { opacity:0; transform: scale(0.94); }
          to { opacity:1; transform: scale(1); }
        }
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        *::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

// 弹窗样式
const maskStyle = {
  position:"absolute",
  inset:0,
  background:"rgba(0,0,0,0.35)",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  zIndex:999,
  animation:"modalFadeIn 0.22s ease-out"
};
const modalBoxStyle = {
  width:"86%",
  maxWidth:420,
  background:"#FFFDFB",
  borderRadius:20,
  padding:24,
  boxShadow:"0 6px 22px rgba(140,84,104,0.15)"
};
const inputStyle = {
  width:"100%",
  boxSizing:"border-box",
  border:"1px solid #F0D2DC",
  borderRadius:12,
  padding:"12px 14px",
  fontSize:14,
  background:"#fff",
  outline:"none"
};
const radioLabelStyle = {
  fontSize: 13,
  padding: "8px 14px",
  borderRadius: 999,
  background: "#FFFDFB",
  color: "#B98A96",
  border: "1px solid #F0D2DC",
  cursor: "pointer",
  transition: "all 0.2s ease",
};
const btnCancel = {
  padding:"10px 18px",
  borderRadius:12,
  border:"1px solid #D8B7BE",
  background:"transparent",
  color:"#8C5468",
  cursor:"pointer",
  fontSize:14
};
const btnPrimary = {
  padding:"10px 20px",
  borderRadius:12,
  border:"none",
  background:"#F6DDE3",
  color:"#8C5468",
  fontWeight:600,
  cursor:"pointer",
  fontSize:14
};
