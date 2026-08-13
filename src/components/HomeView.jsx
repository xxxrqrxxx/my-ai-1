import React, { useState, useEffect } from 'react';
import { STATUS_WORDS, getRandomStatus } from '../statusWords';
import { getMindState, getSessions } from '../api';

const DRIVE_NAMES = {
  longing: '思念', curiosity: '好奇', affection: '亲昵', playfulness: '调皮',
  comfort: '安心', attention: '关注', intimacy: '亲密', autonomy: '自主',
  novelty: '新奇', stability: '稳定', gratitude: '感恩', anticipation: '期待',
};

export default function HomeView({ userName, onOpenChat, onOpenDiary, onOpenWhisper, onOpenLetter }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentStatus, setCurrentStatus] = useState(getRandomStatus());
  const [mindState, setMindState] = useState(null);
  const [chatDates, setChatDates] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const saved = localStorage.getItem('together_start_date');
    return saved ? new Date(saved) : new Date();
  });
  const [showDateModal, setShowDateModal] = useState(false);
  const [tempDate, setTempDate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mind, sessions] = await Promise.all([
        getMindState().catch(() => null),
        getSessions().catch(() => []),
      ]);
      setMindState(mind);
      const dates = new Set();
      (sessions || []).forEach(s => {
        if (s.updated_at) dates.add(s.updated_at.split('T')[0]);
        if (s.created_at) dates.add(s.created_at.split('T')[0]);
      });
      setChatDates([...dates]);
    } catch (e) {
      console.error('加载首页数据失败:', e);
    }
  };

  // 修复时区bug - 用本地日期格式化
  const formatLocalDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const daysTogether = Math.max(0, Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24)));

  const openDateModal = () => {
    setTempDate(formatLocalDate(startDate));
    setShowDateModal(true);
  };

  const saveDate = () => {
    if (tempDate) {
      const newDate = new Date(tempDate + 'T00:00:00');
      setStartDate(newDate);
      localStorage.setItem('together_start_date', newDate.toISOString());
    }
    setShowDateModal(false);
  };

  const shuffleStatus = () => setCurrentStatus(getRandomStatus());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const hasChat = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return chatDates.includes(dateStr);
  };

  const isToday = (day) => {
    return year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
  };

  const handleDateClick = (day) => {
    if (!day) return;
    if (hasChat(day)) onOpenDiary && onOpenDiary();
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const ChevronLeft = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );

  const ChevronRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  return (
    <div className="page-container">
      <div className="page-content" style={{ padding: '50px 20px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Arden</h1>
          <div className="status-bar" onClick={shuffleStatus} style={{ cursor: 'pointer' }}>
            <span className="status-item"><span className="status-dot" />{currentStatus}</span>
          </div>
        </div>

        {/* 心智状态卡片 - 不动 */}
        {mindState && (
          <div className="jelly-card" style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Arden 的心智</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 14px' }}>
              {Object.entries(DRIVE_NAMES).map(([key, name]) => {
                const value = mindState.drives?.[key] || 0;
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', width: 32, flexShrink: 0 }}>{name}</span>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--accent-lighter)', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.round(value * 100)}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
            {mindState.flashes?.length > 0 && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>此刻的闪念</div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {typeof mindState.flashes[0] === 'string' ? mindState.flashes[0] : (mindState.flashes[0].content || '')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 四宫格 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {/* 缩小版日历 */}
          <div className="jelly-card" style={{ padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <button onClick={prevMonth} className="jelly-button" style={{ width: 24, height: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <ChevronLeft />
              </button>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{monthNames[month]}</span>
              <button onClick={nextMonth} className="jelly-button" style={{ width: 24, height: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <ChevronRight />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, marginBottom: 2 }}>
              {weekDays.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 9, color: 'var(--text-muted)', fontWeight: 500, padding: '2px 0' }}>{d}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
              {days.map((day, i) => (
                <div key={i} onClick={() => handleDateClick(day)} style={{
                  aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, borderRadius: 6, cursor: day && hasChat(day) ? 'pointer' : 'default',
                  color: isToday(day) ? 'white' : hasChat(day) ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: isToday(day) ? 'var(--accent-gradient)' : hasChat(day) ? 'var(--accent-lighter)' : 'transparent',
                  fontWeight: isToday(day) || hasChat(day) ? 600 : 400, position: 'relative', transition: 'all 0.15s',
                }}>
                  {day}
                  {hasChat(day) && !isToday(day) && (
                    <span style={{ position: 'absolute', bottom: 1, width: 2, height: 2, borderRadius: '50%', background: 'var(--accent)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 在一起天数 - 对齐日历 */}
          <div className="jelly-card" style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'center', minHeight: 120 }} onClick={openDateModal}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.2, fontWeight: 500, letterSpacing: 0.3, marginTop: 18 }}>we have stayed close for</div>
            <div style={{ fontSize: 52, fontWeight: 800, color: 'var(--accent)', lineHeight: 1, letterSpacing: -2, margin: 'auto 0' }}>{daysTogether}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.2, fontWeight: 500, letterSpacing: 0.3, marginBottom: 18 }}>days, and counting</div>
          </div>

          {/* 悄悄话入口 */}
          <div className="jelly-card" style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 8 }} onClick={() => onOpenWhisper && onOpenWhisper()}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>悄悄话</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Whisper</span>
          </div>

          {/* 写信入口 */}
          <div className="jelly-card" style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 8 }} onClick={() => onOpenLetter && onOpenLetter()}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>写信</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Letter</span>
          </div>
        </div>

        {/* 日期设置弹窗 - 参考记忆页面风格 */}
        {showDateModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.35)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }} onClick={() => setShowDateModal(false)}>
            <div style={{
              width: '100%', maxWidth: 320,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              borderRadius: 28,
              padding: '24px 20px 20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              border: '1px solid rgba(255,255,255,0.6)',
            }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 18 }}>设置起始日期</div>
              <input
                type="date"
                value={tempDate}
                onChange={e => setTempDate(e.target.value)}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 16,
                  border: '1.5px solid var(--accent-lighter)',
                  background: 'rgba(255,255,255,0.7)',
                  color: 'var(--text-primary)', fontSize: 15, marginBottom: 18,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setShowDateModal(false)}
                  style={{
                    flex: 1, padding: '14px 0', borderRadius: 16,
                    border: 'none', background: 'rgba(255,255,255,0.8)',
                    color: 'var(--text-secondary)', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                  }}
                >取消</button>
                <button
                  onClick={saveDate}
                  style={{
                    flex: 1, padding: '14px 0', borderRadius: 16,
                    border: 'none', background: 'var(--accent-gradient)',
                    color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    boxShadow: 'var(--shadow-accent)',
                  }}
                >保存</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
