import React, { useState } from 'react';
import { mockDiaries } from '../mockData';

const Icon = ({ name, size = 18, color = 'var(--text-secondary)' }) => {
  const sw = 1.8;
  switch(name) {
    case 'chevron-left':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
    case 'chevron-right':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
    default: return null;
  }
};

export default function DiaryView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  
  const monthDiaries = mockDiaries.filter(d => {
    const dDate = new Date(d.date);
    return dDate.getFullYear() === year && dDate.getMonth() === month;
  });

  return (
    <div className="page-container">
      <div className="page-content" style={{ padding: '50px 16px 100px' }}>
        {/* 标题 - 副标题改中文 */}
        <div style={{ marginBottom: 20, textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            Diary
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Arden 的私密日记
          </p>
        </div>

        {/* 月份切换 */}
        <div className="jelly-card" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', marginBottom: 16,
        }}>
          <button onClick={prevMonth} className="jelly-button" style={{ width: 34, height: 34 }}>
            <Icon name="chevron-left" size={16} />
          </button>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            {year}年 {monthNames[month]}
          </span>
          <button onClick={nextMonth} className="jelly-button" style={{ width: 34, height: 34 }}>
            <Icon name="chevron-right" size={16} />
          </button>
        </div>

        {/* 日记列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {monthDiaries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
              这个月还没有日记
            </div>
          ) : (
            monthDiaries.map(diary => (
              <div key={diary.id} className="jelly-card" style={{ padding: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, marginBottom: 8 }}>
                  {diary.date}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {diary.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
