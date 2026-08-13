import React, { useState, useEffect } from 'react';
import { getMcpServers, toggleMcpServer, addMcpServer, deleteMcpServer } from '../api';

const Icon = ({ name, size = 20, color = 'var(--text-secondary)' }) => {
  const sw = 1.8;
  switch(name) {
    case 'plus':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case 'x':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    case 'trash':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
    default: return null;
  }
};

export default function McpView() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => { loadServers(); }, []);

  const loadServers = async () => {
    try {
      const data = await getMcpServers();
      setServers(data || []);
    } catch (e) {
      console.error('加载MCP失败:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleServer = async (id) => {
    try {
      await toggleMcpServer(id);
      loadServers();
    } catch (e) {
      console.error('切换失败:', e);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await addMcpServer({ name: newName, url: newUrl });
      setNewName(''); setNewUrl(''); setShowAdd(false);
      loadServers();
    } catch (e) {
      console.error('添加失败:', e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMcpServer(id);
      loadServers();
    } catch (e) {
      console.error('删除失败:', e);
    }
  };

  return (
    <div className="page-container">
      <div className="page-content" style={{ padding: '50px 16px 100px' }}>
        <div style={{ marginBottom: 20, textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>MCP</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>扩展 Arden 的能力</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>加载中...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {servers.map(server => (
              <div key={server.id} className="jelly-card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{server.name}</span>
                      {server.builtin && <span className="tag" style={{ fontSize: 10 }}>内置</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 12, color: server.connected ? 'var(--accent)' : 'var(--text-muted)', fontWeight: server.connected ? 600 : 400, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: server.connected ? 'var(--accent)' : 'var(--text-muted)' }} />
                        {server.connected ? '已连接' : '未连接'}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>工具 {server.tools || 0}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {!server.builtin && (
                      <button onClick={() => handleDelete(server.id)} style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}>
                        <Icon name="trash" size={16} color="var(--text-muted)" />
                      </button>
                    )}
                    <button onClick={() => toggleServer(server.id)} className={`toggle-switch ${server.connected ? 'active' : ''}`} aria-label="切换连接" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => setShowAdd(true)} className="jelly-button" style={{ width: '100%', height: 50, marginTop: 16, borderRadius: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15, color: 'var(--text-secondary)' }}>
          <Icon name="plus" size={18} />
          添加 MCP 服务器
        </button>

        <div className="jelly-card" style={{ marginTop: 16, padding: 14 }}>
          <p style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--text-muted)' }}>
            MCP 是 Model Context Protocol 的缩写，可以让 Arden 连接外部工具和数据源。目前管理页面已就绪，实际工具调用功能后续接入。
          </p>
        </div>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 16, marginTop: 8 }}>添加 MCP 服务器</h3>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>名称</div>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="比如：我的MCP" style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>URL（可选）</div>
              <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }} />
            </div>
            <button onClick={handleAdd} className="jelly-button jelly-button-accent" style={{ width: '100%', height: 48, borderRadius: 24, fontSize: 15, fontWeight: 600 }}>添加</button>
          </div>
        </div>
      )}
    </div>
  );
}
