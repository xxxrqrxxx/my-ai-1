import React, { useState } from 'react';

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

// 初始mock数据
const initMemories = [
  { id: 1, title: "口味偏好", text: "不太能吃辣，喜欢奶茶去冰三分糖，讨厌香菜。", tag: "喜好", time: "7月28日更新" },
  { id: 2, title: "作息习惯", text: "工作日通常凌晨1点前后睡觉，容易熬夜追剧。", tag: "日常", time: "7月25日更新" },
  { id: 3, title: "重要日子", text: "9月14日生日，喜欢惊喜但不喜欢太隆重的场面。", tag: "重要日子", time: "7月20日更新" },
];
const initTabs = ["全部", "喜好", "日常", "重要日子"];

// ✅接收onClose回调
export default function MemoryView({ onClose }) {
  const [isExiting, setIsExiting] = useState(false);
  const [tab, setTab] = useState('全部');
  const [query, setQuery] = useState('');

  // 内部状态接管数据
  const [memories, setMemories] = useState(initMemories);
  const [memoryTabs, setMemoryTabs] = useState(initTabs);

  // 弹窗状态
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // 编辑时存当前卡片，新增为null
  const [formTitle, setFormTitle] = useState("");
  const [formText, setFormText] = useState("");
  const [formTag, setFormTag] = useState("喜好");

  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");

  // ✅关闭页面：先播放退场动画，0.28s后执行onClose切回上一页
  const handleClosePage = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 280);
  };

  // 筛选记忆列表
  const filtered = memories.filter((m) => {
    const matchTab = tab === '全部' || m.tag === tab;
    const matchQuery = !query || m.title.includes(query) || m.text.includes(query);
    return matchTab && matchQuery;
  });

  // 打开新增记忆弹窗
  const openAddMemory = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormText("");
    setFormTag(memoryTabs[1]);
    setShowMemoryModal(true);
  };

  // 打开编辑记忆弹窗
  const openEditMemory = (item) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormText(item.text);
    setFormTag(item.tag);
    setShowMemoryModal(true);
  };

  // 保存记忆（新增/编辑）
  const saveMemory = () => {
    if (!formTitle.trim() || !formText.trim()) return;
    const now = new Date();
    const timeStr = `${now.getMonth() + 1}月${now.getDate()}日更新`;

    if (editingItem) {
      // 编辑模式
      setMemories(prev => prev.map(i => {
        if (i.id === editingItem.id) {
          return { ...i, title: formTitle.trim(), text: formText.trim(), tag: formTag, time: timeStr };
        }
        return i;
      }));
    } else {
      // 新增模式
      const newId = Math.max(...memories.map(x => x.id), 0) + 1;
      const newMem = {
        id: newId,
        title: formTitle.trim(),
        text: formText.trim(),
        tag: formTag,
        time: timeStr
      };
      setMemories(prev => [...prev, newMem]);
    }
    setShowMemoryModal(false);
  };

  // 删除记忆
  const deleteMemory = (id) => {
    setMemories(prev => prev.filter(i => i.id !== id));
  };

  // 添加新分类
  const saveNewCategory = () => {
    const val = newCatInput.trim();
    if (!val || memoryTabs.includes(val)) return;
    setMemoryTabs(prev => [...prev, val]);
    setNewCatInput("");
    setShowCatModal(false);
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
        {/* ✅头部：左返回箭头｜中间标题｜右上角加号按钮，和截图UI一致 */}
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
          {/* 返回按钮 */}
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

          {/* 右上角新增记忆加号按钮 */}
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

          {/* 标签栏，末尾放添加分类按钮 */}
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

          {/* 记忆卡片列表，点击卡片打开编辑弹窗 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map((m) => (
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
                    <TrashIcon onClick={()=>deleteMemory(m.id)} style={{ width:18, height:18, cursor:'pointer' }} />
                  </div>
                </div>
                <div style={{ fontSize:15, lineHeight:1.7, color:'#5B4A4E', marginBottom:10 }}>{m.text}</div>
                <div style={{ fontSize:12, textAlign:'right', color:'#CBAAB1' }}>{m.time}</div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign:'center', fontSize:14, padding:'60px 20px', color:'#C9AAB2' }}>
                没有找到相关的记忆～
              </div>
            )}
          </div>
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
              <button onClick={saveMemory} style={btnPrimary}>保存</button>
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