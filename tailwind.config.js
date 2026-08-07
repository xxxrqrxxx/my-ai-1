// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          bg: '#FBF2F1',
          card: '#FFFDFB',
          accent: '#E9A9BC',
          accentSoft: '#F6DDE3',
          accentBorder: '#EFC9D4',
          deep: '#8C5468',
          text: '#4A3B3F',
          muted: '#B98A96',
          faint: '#C9AAB2',
          line: '#F0DDE1',
          glow: '#FCE9EE',
        },
      },
      fontFamily: {
        display: ['Georgia', '"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        bubble: '18px',
        card: '20px',
        phone: '36px',
      },
      boxShadow: {
        card: '0 2px 10px rgba(201,122,147,0.08), inset 0 0 0 1px #F5E6E9',
        input: '0 2px 14px rgba(201,122,147,0.10), inset 0 0 0 1px #F5E1E6',
        btn: '0 8px 24px rgba(233,169,188,0.5)',
        phoneFrame: '0 20px 60px rgba(150,80,100,0.25)',
      },
    },
  },
  plugins: [],
};