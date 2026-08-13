import React, { useState, useEffect } from 'react';
import { STATUS_PRESETS } from '../mockData';
import { getMindState, getSessions } from '../api';

const DRIVE_NAMES = {
  longing: '思念', curiosity: '好奇', affection: '亲昵', playfulness: '调皮',
  comfort: '安心', attention: '关注', intimacy: '亲密', autonomy: '自主',
  novelty: '新奇', stability: '稳定', gratitude: '感恩', anticipation: '期待',
};

export default function HomeView({ userName, onOpenChat, onOpenDiary }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentStatus] = useState(STATUS_PRESETS[7]);
  const [mindState, setMindState] = useState(null);
  const [chatDates, setChatDates] = useState([]);

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
    if (hasChat(day)) onOpenDiary();
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="page-container">
      <div className="page-content" style={{ padding: '50px 20px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Arden</h1>
          <div className="status-bar">
            <span className="status-item"><span className="status-dot" />{currentStatus.zh}</span>
          </div>
        </div>

        {/* 心智状态卡片 */}
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

        <div className="jelly-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <button onClick={prevMonth} className="jelly-button" style={{ width: 32, height: 32, fontSize: 16 }}>‹</button>
            <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>{year}年 {monthNames[month]}</span>
            <button onClick={nextMonth} className="jelly-button" style={{ width: 32, height: 32, fontSize: 16 }}>›</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {weekDays.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, padding: '6px 0' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {days.map((day, i) => (
              <div key={i} onClick={() => handleDateClick(day)} style={{
                aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, borderRadius: 10, cursor: day && hasChat(day) ? 'pointer' : 'default',
                color: isToday(day) ? 'white' : hasChat(day) ? 'var(--text-primary)' : 'var(--text-muted)',
                background: isToday(day) ? 'var(--accent-gradient)' : hasChat(day) ? 'var(--accent-lighter)' : 'transparent',
                fontWeight: isToday(day) || hasChat(day) ? 600 : 400, position: 'relative', transition: 'all 0.15s',
              }}>
                {day}
                {hasChat(day) && !isToday(day) && (
                  <span style={{ position: 'absolute', bottom: 3, width: 3, height: 3, borderRadius: '50%', background: 'var(--accent)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
