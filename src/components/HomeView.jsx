import React, { useState } from 'react';
import { STATUS_PRESETS, chatDates } from '../mockData';

export default function HomeView({ userName, onOpenChat, onOpenDiary }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentStatus] = useState(STATUS_PRESETS[7]);

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
    return year === today.getFullYear() && 
           month === today.getMonth() && 
           day === today.getDate();
  };
  
  const handleDateClick = (day) => {
    if (!day) return;
    if (hasChat(day)) {
      onOpenDiary();
    }
  };
  
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  
  return (
    <div className="page-container">
      <div className="page-content" style={{ padding: '50px 20px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 10,
          }}>
            Arden
          </h1>
          <div className="status-bar">
            <span className="status-item">
              <span className="status-dot" />
              {currentStatus.zh}
            </span>
          </div>
        </div>
        
        <div className="jelly-card" style={{ padding: 18 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <button onClick={prevMonth} className="jelly-button" style={{ width: 32, height: 32, fontSize: 16 }}>
              ‹
            </button>
            <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>
              {year}年 {monthNames[month]}
            </span>
            <button onClick={nextMonth} className="jelly-button" style={{ width: 32, height: 32, fontSize: 16 }}>
              ›
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {weekDays.map(d => (
              <div key={d} style={{
                textAlign: 'center', fontSize: 12, color: 'var(--text-muted)',
                fontWeight: 500, padding: '6px 0',
              }}>{d}</div>
            ))}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {days.map((day, i) => (
              <div
                key={i}
                onClick={() => handleDateClick(day)}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  borderRadius: 10,
                  cursor: day && hasChat(day) ? 'pointer' : 'default',
                  color: isToday(day) ? 'white' : 
                         hasChat(day) ? 'var(--text-primary)' : 
                         'var(--text-muted)',
                  background: isToday(day) 
                    ? 'linear-gradient(135deg, var(--bg-accent) 0%, #D8709A 100%)'
                    : hasChat(day) ? 'var(--bg-accent-light)' : 'transparent',
                  fontWeight: isToday(day) || hasChat(day) ? 600 : 400,
                  position: 'relative',
                  transition: 'all 0.15s',
                }}
              >
                {day}
                {hasChat(day) && !isToday(day) && (
                  <span style={{
                    position: 'absolute', bottom: 3, width: 3, height: 3,
                    borderRadius: '50%', background: 'var(--bg-accent)',
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}