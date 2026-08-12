import React, { useState, useEffect, useRef } from 'react';
import { MODELS, SETTINGS_PRESETS, USAGE_DATA } from '../mockData';

const Icon = ({ name, size = 20, color = 'var(--text-secondary)' }) => {
  const sw = 1.8;
  switch(name) {
    case 'chevron-left':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
    case 'chevron-right':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
    case 'upload':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
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
      style={{ width: '100%' }}
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

export default function SettingsView() {
  const [page, setPage] = useState('main');
  const [darkMode, setDarkMode] = useState(false);
  
  const [systemPrompt, setSystemPrompt] = useState(SETTINGS_PRESETS.systemPrompt);
  const [temperature, setTemperature] = useState(0.8);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [topP, setTopP] = useState(0.9);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const renderUsagePage = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => setPage('main')} className="jelly-button" style={{ width: 36, height: 36 }}>
          <Icon name="chevron-left" size={18} />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>用量统计</h2>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {USAGE_DATA.map(item => {
          const model = MODELS.find(m => m.id === item.modelId);
          const percent = Math.min(100, (item.used / item.total) * 100);
          return (
            <div key={item.modelId} className="jelly-card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>{model?.name}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {item.used.toLocaleString()} / {item.total.toLocaleString()} tokens
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'var(--glass-bg)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  width: `${percent}%`,
                  background: 'var(--accent-gradient)',
                  transition: 'width 0.3s',
                }} />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="jelly-card" style={{ marginTop: 16, padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>本月总用量</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {USAGE_DATA.reduce((sum, i) => sum + i.used, 0).toLocaleString()} tokens
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>今日用量</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>2,847 tokens</span>
        </div>
      </div>
    </div>
  );

  const renderGeneralPage = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => setPage('main')} className="jelly-button" style={{ width: 36, height: 36 }}>
          <Icon name="chevron-left" size={18} />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>通用设置</h2>
      </div>
      
      <div className="jelly-card" style={{ padding: 16, marginBottom: 14 }}>
        <label style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
          系统提示词
        </label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={5}
          className="jelly-input"
          style={{
            width: '100%', borderRadius: 12,
            padding: 12, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6,
            resize: 'none', outline: 'none', fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />
      </div>
      
      <div className="jelly-card" style={{ padding: '8px 16px' }}>
        <Slider label="Temperature" value={temperature} min={0} max={2} step={0.1} unit="" onChange={setTemperature} />
        <Slider label="Max tokens" value={maxTokens} min={512} max={8192} step={128} unit="" onChange={setMaxTokens} />
        <Slider label="Top-p" value={topP} min={0} max={1} step={0.05} unit="" onChange={setTopP} />
      </div>
    </div>
  );

  const renderFilesPage = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => setPage('main')} className="jelly-button" style={{ width: 36, height: 36 }}>
          <Icon name="chevron-left" size={18} />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>文件添加</h2>
      </div>
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="jelly-card"
        style={{
          width: '100%', padding: 40, border: '2px dashed var(--glass-border)',
          background: 'transparent', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}
      >
        <Icon name="upload" size={36} color="var(--accent)" />
        <span style={{ fontSize: 15, color: 'var(--text-secondary)' }}>点击上传 docx / txt 文件</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Arden 可以读取这些文件作为参考</span>
      </button>
      <input ref={fileInputRef} type="file" accept=".docx,.txt,.pdf" style={{ display: 'none' }} />
    </div>
  );

  const renderMainPage = () => (
    <div>
      {/* 标题 + 副标题移到这里 */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Settings
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
          和 Arden 的专属小窝
        </p>
      </div>
      
      {/* 第一组：通用设置、字体选择、深色模式（同一级） */}
      <div className="jelly-card" style={{ padding: '4px 16px', marginBottom: 14 }}>
        <ListItem label="通用设置" onClick={() => setPage('general')} />
        <ListItem
          label="字体选择"
          right={<span style={{ fontSize: 13, color: 'var(--text-muted)' }}>系统默认</span>}
          onClick={() => {}}
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
      </div>
      
      {/* 第二组：文件添加、用量统计（删掉了默认设置和记忆设置） */}
      <div className="jelly-card" style={{ padding: '4px 16px' }}>
        <ListItem label="文件添加" onClick={() => setPage('files')} />
        <ListItem label="用量统计" onClick={() => setPage('usage')} />
      </div>
      
      {/* 底部版本号 */}
      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 30, opacity: 0.7 }}>
        Arden's Home · v0.2
      </p>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-content" style={{ padding: '50px 16px 100px' }}>
        {page === 'main' && renderMainPage()}
        {page === 'general' && renderGeneralPage()}
        {page === 'files' && renderFilesPage()}
        {page === 'usage' && renderUsagePage()}
      </div>
    </div>
  );
}
