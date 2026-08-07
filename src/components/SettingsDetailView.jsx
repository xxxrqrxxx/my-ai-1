import React, { useState } from 'react';

const SettingsDetailView = ({ config = {}, setConfig, onClose, onBack }) => {
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [tempNickname, setTempNickname] = useState(config.nickname || '');

  const handleSave = () => {
    setConfig({ ...config });
    onBack();
  };

  const handleNicknameSave = () => {
    setConfig({ ...config, nickname: tempNickname });
    setShowNicknameModal(false);
  };

  return (
    <div className="glass-modal-overlay" style={{animation: 'slideInRight var(--anim-slide-right-in)'}}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth:620,
        maxHeight:'88vh',
        overflowY:'auto',
        padding:'28px'
      }}>
        {/* 返回头部 */}
        <div style={{ display:'flex', alignItems:'center', marginBottom:'24px' }}>
          <button
            onClick={onBack}
            className="btn-tap"
            style={{
              background:'var(--color-accent-soft)',
              border:'none',
              borderRadius:'50%',
              width:'36px',
              height:'36px',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              color:'var(--color-text-deep)',
              cursor:'pointer'
            }}
          >
            ←
          </button>
          <h2 style={{ margin:'0 0 0 14px', fontSize:'20px', color:'var(--color-text-deep)' }}>通用设置</h2>
        </div>

        {/* 头像昵称卡片 */}
        <div className="glass-card" style={{ padding:'18px', marginBottom:'20px' }}>
          <div
            onClick={()=>setShowNicknameModal(true)}
            className="btn-tap"
            style={{ display:'flex', alignItems:'center', gap:'14px', cursor:'pointer' }}
          >
            <div style={{
              width:52,
              height:52,
              borderRadius:'50%',
              background:'var(--color-accent)',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              color:'white',
              fontSize:'20px'
            }}>
              {(config.nickname||'N').charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight:500, color:'var(--color-text-deep)' }}>{config.nickname||'未设置昵称'}</div>
              <div style={{ fontSize:'13px', color:'var(--color-text-muted)' }}>点击修改昵称</div>
            </div>
          </div>
        </div>

        {/* 系统人格提示词 */}
        <div style={{ marginBottom:'20px' }}>
          <label style={{ display:'block', marginBottom:'8px', color:'var(--color-text-deep)' }}>系统人格提示词</label>
          <textarea
            className="glass-input"
            value={config.systemPrompt||''}
            onChange={(e)=>setConfig({...config, systemPrompt:e.target.value})}
            style={{
              width:'100%',
              minHeight:'110px',
              padding:'12px',
              resize:'vertical',
              boxSizing:'border-box'
            }}
            placeholder="填写AI人格设定..."
          />
        </div>

        {/* 模型下拉 */}
        <div style={{ marginBottom:'20px' }}>
          <label style={{ display:'block', marginBottom:'8px', color:'var(--color-text-deep)' }}>选择模型</label>
          <select
            className="glass-input"
            value={config.model||''}
            onChange={(e)=>setConfig({...config, model:e.target.value})}
            style={{ width:'100%', padding:'12px', boxSizing:'border-box' }}
          >
            <option value="gpt-4o">GPT‑4o</option>
            <option value="gpt-3.5-turbo">GPT‑3.5‑Turbo</option>
          </select>
        </div>

        {/* 参数滑块 */}
        <div style={{ marginBottom:'16px' }}>
          <label style={{ display:'flex', justifyContent:'space-between', color:'var(--color-text-deep)', marginBottom:6 }}>
            <span>温度 (temperature)</span>
            <span>{config.temperature??0.7}</span>
          </label>
          <input
            type="range"
            min="0" max="2" step="0.05"
            value={config.temperature??0.7}
            onChange={(e)=>setConfig({...config, temperature:parseFloat(e.target.value)})}
            style={{ width:'100%' }}
          />
        </div>

        <div style={{ marginBottom:'16px' }}>
          <label style={{ display:'flex', justifyContent:'space-between', color:'var(--color-text-deep)', marginBottom:6 }}>
            <span>最大生成长度 (maxTokens)</span>
            <span>{config.maxTokens??1024}</span>
          </label>
          <input
            type="range"
            min="256" max="4096" step="128"
            value={config.maxTokens??1024}
            onChange={(e)=>setConfig({...config, maxTokens:parseInt(e.target.value)})}
            style={{ width:'100%' }}
          />
        </div>

        <div style={{ marginBottom:'16px' }}>
          <label style={{ display:'flex', justifyContent:'space-between', color:'var(--color-text-deep)', marginBottom:6 }}>
            <span>Top‑P</span>
            <span>{config.topP??0.9}</span>
          </label>
          <input
            type="range"
            min="0" max="1" step="0.05"
            value={config.topP??0.9}
            onChange={(e)=>setConfig({...config, topP:parseFloat(e.target.value)})}
            style={{ width:'100%' }}
          />
        </div>

        {/* 开关 */}
        <div className="glass-card" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px', marginBottom:'24px' }}>
          <span style={{ color:'var(--color-text-deep)' }}>静静思考模式</span>
          <label style={{
            position:'relative',
            width:48,
            height:24,
            background: config.thinkMode ? 'var(--color-accent)' : 'var(--color-accent-soft)',
            borderRadius:999,
            display:'inline-block',
            cursor:'pointer'
          }}>
            <input
              type="checkbox"
              checked={!!config.thinkMode}
              onChange={(e)=>setConfig({...config, thinkMode:e.target.checked})}
              style={{ opacity:0, width:0, height:0 }}
            />
            <span style={{
              position:'absolute',
              top:2,
              left: config.thinkMode ? 26 : 2,
              width:20,
              height:20,
              background:'#fff',
              borderRadius:'50%',
              transition:'0.2s'
            }}/>
          </label>
        </div>

        {/* 保存按钮 */}
        <button
          onClick={handleSave}
          className="btn-tap"
          style={{
            width:'100%',
            padding:'14px',
            borderRadius:'var(--radius-btn-input)',
            border:'none',
            background:'var(--color-accent)',
            color:'#ffffff',
            fontSize:'16px',
            cursor:'pointer'
          }}
        >保存设置</button>

        {/* 修改昵称弹窗 */}
        {showNicknameModal && (
          <div className="glass-modal-overlay">
            <div className="glass-card" style={{ width:'90%', maxWidth:420, padding:'24px' }}>
              <h3 style={{ margin:'0 0 16px 0', color:'var(--color-text-deep)' }}>修改昵称</h3>
              <input
                className="glass-input"
                value={tempNickname}
                onChange={(e)=>setTempNickname(e.target.value)}
                placeholder="输入昵称"
                style={{ width:'100%', padding:'12px', boxSizing:'border-box', marginBottom:'20px' }}
              />
              <div style={{ display:'flex', gap:'12px' }}>
                <button
                  onClick={()=>setShowNicknameModal(false)}
                  className="btn-tap"
                  style={{
                    flex:1,
                    padding:'12px',
                    borderRadius:'var(--radius-btn-input)',
                    border:'1px solid var(--card-border)',
                    background:'var(--color-accent-soft)',
                    color:'var(--color-text-deep)',
                    cursor:'pointer'
                  }}
                >取消</button>
                <button
                  onClick={handleNicknameSave}
                  className="btn-tap"
                  style={{
                    flex:1,
                    padding:'12px',
                    borderRadius:'var(--radius-btn-input)',
                    border:'none',
                    background:'var(--color-accent)',
                    color:'white',
                    cursor:'pointer'
                  }}
                >确认</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsDetailView;