import React, { useState } from 'react';
import { mockDiaries } from '../mockData';

const Icon = ({ name, size = 20, color = 'var(--text-secondary)' }) => {
  const sw = 1.8;
  switch(name) {
    case 'chevron-left':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
    case 'chevron-right':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
    case 'book':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
    default: return null;
  }
};

export default function DiaryView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  
  const filteredDiaries = mockDiaries.filter(diary => {
    const diaryDate = new Date(diary.date);
    return diaryDate.getFullYear() === year && diaryDate.getMonth() === month;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };

  return (
    <div className="page-container">
      <div className="page-content" style={{ padding: '50px 16px 100px' }}>
        <div style={{ marginBottom: 18, textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            Diary
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
            his private notes
          </p>
        </div>
        
        {/* 月份切换 */}
        <div className="jelly-card" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', marginBottom: 16,
        }}>
          <button onClick={prevMonth} className="jelly-button" style={{ width: 32, height: 32 }}>
            <Icon name="chevron-left" size={16} />
          </button>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            {year}年 {monthNames[month]}
          </span>
          <button onClick={nextMonth} className="jelly-button" style={{ width: 32, height: 32 }}>
            <Icon name="chevron-right" size={16} />
          </button>
        </div>
        
        {/* 日记列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredDiaries.length > 0 ? filteredDiaries.map(diary => (
            <div key={diary.id} className="jelly-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Icon name="book" size={16} color="var(--bg-accent)" />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--bg-accent)' }}>
                  {formatDate(diary.date)}
                </span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                {diary.content}
              </p>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
              <Icon name="book" size={40} color="var(--text-muted)" />
              <p style={{ fontSize: 14, marginTop: 12 }}>这个月还没有日记</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}