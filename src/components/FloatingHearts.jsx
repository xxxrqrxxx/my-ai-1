import React, { useMemo } from 'react';
// 漂浮爱心背景组件 - 从下往上慢慢飘
export default function FloatingHearts() {
  const hearts = useMemo(() => {
    // 生成12个随机位置的爱心，从屏幕底部往上飘
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      size: 14 + Math.random() * 18,
      delay: Math.random() * 20,
      duration: 18 + Math.random() * 12,
      opacity: 0.12 + Math.random() * 0.15,
    }));
  }, []);

  return (
    <div className="floating-hearts">
      {hearts.map(h => (
        <svg
          key={h.id}
          className="heart"
          style={{
            left: h.left,
            bottom: '-50px',
            width: h.size,
            height: h.size,
            opacity: h.opacity,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 21l-1.45-1.32C5.4 15.36, 2 12.28, 2 8.5 2 5.42, 4.42 3, 7.5 3c1.74 0, 3.41.81, 4.5 2.09C13.09 3.81, 14.76 3, 16.5 3 19.58 3, 22 5.42, 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
        </svg>
      ))}
    </div>
  );
}