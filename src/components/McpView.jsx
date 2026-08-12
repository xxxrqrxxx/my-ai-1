import React, { useState } from 'react';
import { mockMcpServers } from '../mockData';

const Icon = ({ name, size = 20, color = 'var(--text-secondary)' }) => {
  const sw = 1.8;
  switch(name) {
    case 'plus':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    default: return null;
  }
};

export default function McpView() {
  const [servers, setServers] = useState(mockMcpServers);
  
  const toggleServer = (id) => {
    setServers(prev => prev.map(s => 
      s.id === id ? { ...s, connected: !s.connected } : s
    ));
  };

  return (
    <div className="page-container">
      <div className="page-content" style={{ padding: '50px 16px 100px' }}>
        <div style={{ marginBottom: 20, textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            MCP
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            扩展 Arden 的能力
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {servers.map(server => (
            <div key={server.id} className="jelly-card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {server.name}
                    </span>
                    {server.builtin && (
                      <span className="tag" style={{ fontSize: 10 }}>内置</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: 12,
                      color: server.connected ? 'var(--accent)' : 'var(--text-muted)',
                      fontWeight: server.connected ? 600 : 400,
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: server.connected ? 'var(--accent)' : 'var(--text-muted)',
                      }} />
                      {server.connected ? '已连接' : '未连接'}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      工具 {server.tools}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleServer(server.id)}
                  className={`toggle-switch ${server.connected ? 'active' : ''}`}
                  aria-label="切换连接"
                />
              </div>
            </div>
          ))}
        </div>
        
        <button className="jelly-button" style={{
          width: '100%', height: 50, marginTop: 16, borderRadius: 25,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 15, color: 'var(--text-secondary)',
        }}>
          <Icon name="plus" size={18} />
          添加 MCP 服务器
        </button>
        
        <div className="jelly-card" style={{ marginTop: 16, padding: 14 }}>
          <p style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--text-muted)' }}>
            MCP 是 Model Context Protocol 的缩写，可以让 Arden 连接外部工具和数据源。
            目前 UI 已就绪，实际功能后续接后端后即可使用。
            "工具 N" 表示该 MCP 服务器提供了 N 个可调用的工具函数。
          </p>
        </div>
      </div>
    </div>
  );
}
