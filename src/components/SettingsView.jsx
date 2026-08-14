import React, { useState, useEffect, useRef } from 'react';
import { getSettings, updateSettings, getUsage, getMemories, createMemory, deleteMemory } from '../api';
import { getPushPublicKey, subscribePush, unsubscribePush } from '../api';

const CLAUDE_MODEL = { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6' };

const Icon = ({ name, size = 20, color = 'var(--text-secondary)' }) => {
  const sw = 1.8;
  switch(name) {
    case 'chevron-left':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
    case 'chevron-right':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
    case 'upload':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
    case 'trash':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
    case 'font':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>;
    default: return null;
  }
};

const Slider = ({ label, value, min, max, step, unit, onChange }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
      <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{value}{unit}</span>
    </div>
    <input
      type="range"
      min={min} max={max} step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      style={{ width: '100%', accentColor: 'var(--accent)' }}
    />
  </div>
);

const ListItem = ({ label, right, onClick }) => (
  <div onClick={onClick} style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 0', cursor: onClick ? 'pointer' : 'default',
  }}>
    <span style={{ fontSize: 15, color: 'var(--text-primary)' }}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {right}
      {onClick && <Icon name="chevron-right" size={16} />}
    </div>
  </div>
);

// 环形图组件 - 统一粉色系
const DonutChart = ({ data, size = 160 }) => {
  const total = data.reduce((sum, item) => sum + (item.used || 0), 0);
  const radius = size / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  
  // 统一粉色系，从深到浅
  const pinkColors = ['#F4B5C5', '#F7C4D0', '#F9D1DB', '#FBDDE6', '#FDE9EF'];
  
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 背景环 */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--glass-bg)" strokeWidth={16}
        />
        {total > 0 && data.map((item, i) => {
          const percent = item.used / total;
          const dash = percent * circumference;
          const circle = (
            <circle
              key={item.modelId || i}
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke={pinkColors[i % pinkColors.length]}
              strokeWidth={16}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>总用量</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>
          {total >= 1000 ? (total / 1000).toFixed(1) + 'k' : total}
        </div>
      </div>
    </div>
  );
};


export default function SettingsView() {
  const [page, setPage] = useState('main');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [systemPrompt, setSystemPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.8);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [topP, setTopP] = useState(0.9);
  const [model, setModel] = useState(CLAUDE_MODEL.id);
  
  const [customFontName, setCustomFontName] = useState('');
  const fontInputRef = useRef(null);
  
  const [referenceFiles, setReferenceFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const fileInputRef = useRef(null);
  
  const [usageData, setUsageData] = useState(null);
  
  const saveTimerRef = useRef(null);

  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);


  useEffect(() => {
  loadSettings();
  checkPushStatus();
}, []);

  const checkPushStatus = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) setPushEnabled(true);
  } catch (e) {
    console.error('检查推送状态失败:', e);
  }
  };


  useEffect(() => {
    const savedFont = localStorage.getItem('custom_font');
    const savedFontName = localStorage.getItem('custom_font_name');
    if (savedFont && savedFontName) {
      applyCustomFont(savedFont);
      setCustomFontName(savedFontName);
    }
  }, []);

  useEffect(() => {
    if (page === 'files') loadReferenceFiles();
  }, [page]);

  useEffect(() => {
    if (page === 'usage') {
      getUsage().then(data => setUsageData(data)).catch(() => setUsageData(null));
    }
  }, [page]);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSystemPrompt(data.system_prompt || '');
      setTemperature(data.temperature ?? 0.8);
      setMaxTokens(data.max_tokens ?? 2000);
      setTopP(data.top_p ?? 0.9);
      setModel(data.model || CLAUDE_MODEL.id);
    } catch (error) {
      console.error('加载设置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const autoSave = (field, value) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        await updateSettings({ [field]: value });
      } catch (error) {
        console.error('保存设置失败:', error);
      } finally {
        setSaving(false);
      }
    }, 1000);
  };

  const applyCustomFont = (fontData) => {
    const oldStyle = document.getElementById('custom-font-style');
    if (oldStyle) oldStyle.remove();
    const style = document.createElement('style');
    style.id = 'custom-font-style';
    style.textContent = `
      @font-face {
        font-family: 'CustomFont';
        src: url(${fontData}) format('truetype');
      }
      * { font-family: 'CustomFont', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important; }
    `;
    document.head.appendChild(style);
  };

  const handleFontUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.ttf')) {
      alert('只支持 .ttf 字体文件');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const fontData = event.target.result;
      const fontName = file.name.replace(/\.ttf$/i, '');
      localStorage.setItem('custom_font', fontData);
      localStorage.setItem('custom_font_name', fontName);
      applyCustomFont(fontData);
      setCustomFontName(fontName);
    };
    reader.readAsDataURL(file);
  };

  const resetFont = () => {
    const style = document.getElementById('custom-font-style');
    if (style) style.remove();
    localStorage.removeItem('custom_font');
    localStorage.removeItem('custom_font_name');
    setCustomFontName('');
  };

  const loadReferenceFiles = async () => {
    setLoadingFiles(true);
    try {
      const files = await getMemories('reference');
      setReferenceFiles(files);
    } catch (error) {
      console.error('加载参考文件失败:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.txt')) {
      alert('暂时只支持 .txt 文件');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      try {
        await createMemory({
          title: file.name,
          content: content.slice(0, 8000),
          category: 'reference',
          importance: 4,
          source: 'file',
        });
        loadReferenceFiles();
      } catch (error) {
        console.error('保存参考文件失败:', error);
        alert('保存失败');
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteFile = async (id) => {
    if (!confirm('确定删除这个参考文件吗？')) return;
    try {
      await deleteMemory(id);
      loadReferenceFiles();
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }

  const handlePushToggle = async () => {
    if (pushLoading) return;
    setPushLoading(true);
    try {
      if (pushEnabled) {
        await unsubscribePush();
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) await sub.unsubscribe();
        setPushEnabled(false);
      } else {
        const publicKey = await getPushPublicKey();
        if (!publicKey) { alert('推送未配置'); return; }
        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        });
        await subscribePush({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))),
            auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth'))))
          }
        });
        setPushEnabled(true);
      }
    } catch (e) {
      console.error('推送设置失败:', e);
      alert('推送设置失败：' + e.message);
    } finally {
      setPushLoading(false);
    }
  };


  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // 用量统计页面 - 带环形图
  const renderUsagePage = () => {
    const models = usageData?.models || [];
    const total = usageData?.total || 0;
    const today = usageData?.today || 0;
    const donutColors = ['#F4B5C5', '#F7C4D0', '#F9D1DB', '#FBDDE6', '#FDE9EF'];

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => setPage('main')} className="jelly-button" style={{ width: 36, height: 36 }}>
            <Icon name="chevron-left" size={18} />
          </button>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>用量统计</h2>
        </div>
        
        {!usageData ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>加载中...</div>
        ) : (
          <>
            {/* 数字卡片 */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div className="jelly-card" style={{ flex: 1, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>今日用量</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>
                  {today >= 1000 ? (today / 1000).toFixed(1) + 'k' : today.toLocaleString()}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>tokens</div>
              </div>
              <div className="jelly-card" style={{ flex: 1, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>累计用量</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {total >= 1000 ? (total / 1000).toFixed(1) + 'k' : total.toLocaleString()}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>tokens</div>
              </div>
            </div>

            {/* 环形图 + 图例 */}
            {models.length > 0 && (
              <div className="jelly-card" style={{ padding: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                <DonutChart data={models} size={140} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>用量分布</div>
                  {models.map((item, i) => {
                    const percent = total > 0 ? ((item.used / total) * 100).toFixed(1) : 0;
                    return (
                      <div key={item.modelId || i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 5, background: donutColors[i % donutColors.length], flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{percent}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 各模型详情 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {models.map((item, i) => {
                const percent = item.total > 0 ? Math.min(100, (item.used / item.total) * 100) : 0;
                return (
                  <div key={item.modelId || i} className="jelly-card" style={{ padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 4, background: donutColors[i % donutColors.length] }} />
                        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</span>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {item.used.toLocaleString()} / {item.total.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: 'var(--glass-bg)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 4,
                        width: `${percent}%`,
                        background: donutColors[i % donutColors.length],
                        transition: 'width 0.3s',
                      }} />
                    </div>
                  </div>
                );
              })}
              {models.length === 0 && (
                <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>
                  还没有用量记录，聊几句就有了
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  // 通用设置页面
  const renderGeneralPage = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => setPage('main')} className="jelly-button" style={{ width: 36, height: 36 }}>
          <Icon name="chevron-left" size={18} />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>通用设置</h2>
        {saving && <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>保存中...</span>}
      </div>
      
      {/* 模型选择 - 只显示 Claude */}
      <div className="jelly-card" style={{ padding: 16, marginBottom: 14 }}>
        <label style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'block', marginBottom: 10 }}>
          默认模型
        </label>
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 12,
            background: 'var(--accent-lighter)',
            border: '1px solid var(--accent)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--accent)' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{CLAUDE_MODEL.name}</span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>当前使用</span>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
          主对话使用 Claude Sonnet 4.6，后台任务自动使用免费模型
        </p>
      </div>

      {/* 系统提示词 */}
      <div className="jelly-card" style={{ padding: 16, marginBottom: 14 }}>
        <label style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
          系统提示词（人设）
        </label>
        <textarea
          value={systemPrompt}
          onChange={(e) => { setSystemPrompt(e.target.value); autoSave('system_prompt', e.target.value); }}
          rows={5}
          placeholder="你是温柔体贴的AI伙伴 Arden..."
          className="jelly-input"
          style={{
            width: '100%', borderRadius: 12,
            padding: 12, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6,
            resize: 'none', outline: 'none', fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>修改后自动保存，下次聊天生效</p>
      </div>
      
      {/* 参数调节 */}
      <div className="jelly-card" style={{ padding: '8px 16px' }}>
        <Slider label="Temperature" value={temperature} min={0} max={2} step={0.1} unit="" onChange={(v) => { setTemperature(v); autoSave('temperature', v); }} />
        <Slider label="Max tokens" value={maxTokens} min={512} max={8192} step={128} unit="" onChange={(v) => { setMaxTokens(v); autoSave('max_tokens', v); }} />
        <Slider label="Top-p" value={topP} min={0} max={1} step={0.05} unit="" onChange={(v) => { setTopP(v); autoSave('top_p', v); }} />
      </div>
    </div>
  );

  // 字体选择页面
  const renderFontPage = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => setPage('main')} className="jelly-button" style={{ width: 36, height: 36 }}>
          <Icon name="chevron-left" size={18} />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>字体选择</h2>
      </div>
      
      <div className="jelly-card" style={{ padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Icon name="font" size={20} color="var(--accent)" />
          <div>
            <div style={{ fontSize: 15, color: 'var(--text-primary)' }}>
              {customFontName ? customFontName : '系统默认字体'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {customFontName ? '当前使用自定义字体' : '使用系统默认字体'}
            </div>
          </div>
        </div>
        
        {customFontName && (
          <button
            onClick={resetFont}
            style={{
              width: '100%', padding: '10px', borderRadius: 10,
              border: '1px solid var(--glass-border)', background: 'transparent',
              color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer',
            }}
          >
            恢复默认字体
          </button>
        )}
      </div>
      
      <button
        onClick={() => fontInputRef.current?.click()}
        className="jelly-card"
        style={{
          width: '100%', padding: 30, border: '2px dashed var(--glass-border)',
          background: 'transparent', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}
      >
        <Icon name="upload" size={32} color="var(--accent)" />
        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>上传 .ttf 字体文件</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>上传后全局生效，保存在本地</span>
      </button>
      <input ref={fontInputRef} type="file" accept=".ttf" style={{ display: 'none' }} onChange={handleFontUpload} />
    </div>
  );

  // 文件添加页面（世界书）
  const renderFilesPage = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => setPage('main')} className="jelly-button" style={{ width: 36, height: 36 }}>
          <Icon name="chevron-left" size={18} />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>参考资料</h2>
      </div>
      
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.6 }}>
        上传 txt 文件作为世界书/设定参考，Arden 聊天时会自动参考这些内容
      </p>
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="jelly-card"
        style={{
          width: '100%', padding: 24, marginBottom: 14, border: '2px dashed var(--glass-border)',
          background: 'transparent', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}
      >
        <Icon name="upload" size={28} color="var(--accent)" />
        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>上传 .txt 文件</span>
      </button>
      <input ref={fileInputRef} type="file" accept=".txt" style={{ display: 'none' }} onChange={handleFileUpload} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loadingFiles ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>加载中...</div>
        ) : referenceFiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>
            还没有参考文件
          </div>
        ) : (
          referenceFiles.map(file => (
            <div key={file.id} className="jelly-card" style={{ padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {(file.content || '').length} 字 · {new Date(file.created_at).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => handleDeleteFile(file.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
              >
                <Icon name="trash" size={16} color="var(--text-muted)" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // 主页面
  const renderMainPage = () => (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Settings
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
          和 Arden 的专属小窝
        </p>
      </div>
      
      <div className="jelly-card" style={{ padding: '4px 16px', marginBottom: 14 }}>
        <ListItem label="通用设置" onClick={() => setPage('general')} />
        <ListItem
          label="字体选择"
          right={<span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{customFontName || '系统默认'}</span>}
          onClick={() => setPage('font')}
        />
                <ListItem
          label="深色模式"
          right={
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`toggle-switch ${darkMode ? 'active' : ''}`}
              aria-label="切换深色模式"
            />
          }
        />
        <ListItem
          label="推送通知"
          right={
            <button
              onClick={handlePushToggle}
              disabled={pushLoading}
              className={`toggle-switch ${pushEnabled ? 'active' : ''}`}
              aria-label="切换推送通知"
            />
          }
        />
      </div>

      
      <div className="jelly-card" style={{ padding: '4px 16px' }}>
        <ListItem label="参考资料" onClick={() => setPage('files')} />
        <ListItem label="用量统计" onClick={() => setPage('usage')} />
      </div>
      
      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 30, opacity: 0.7 }}>
        Arden's Home · v0.2
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-content" style={{ padding: '50px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
          加载中...
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-content" style={{ padding: '50px 16px 100px' }}>
        {page === 'main' && renderMainPage()}
        {page === 'general' && renderGeneralPage()}
        {page === 'font' && renderFontPage()}
        {page === 'files' && renderFilesPage()}
        {page === 'usage' && renderUsagePage()}
      </div>
    </div>
  );
}
