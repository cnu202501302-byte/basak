/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        basak: {
          bg: '#FAF6F0',
          card: '#FFFFFF',
          cardMuted: '#F5EFE6',
          border: '#E8DED1',
          terracotta: '#D96B27',
          terracottaHover: '#C25A1A',
          terracottaLight: '#FDEEE6',
          forest: '#2D4739',
          forestLight: '#EAF0EC',
          golden: '#E5A93C',
          goldenLight: '#FDF7EB',
          brown: '#7A4828',
          textDark: '#2C2523',
          textMuted: '#786C66',
        }
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
        serif: ['Nanum Myeongjo', 'serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(45, 71, 57, 0.06)',
        'float': '0 12px 35px -5px rgba(217, 107, 39, 0.15)',
        'glow-orange': '0 0 25px rgba(217, 107, 39, 0.25)',
      },
      animation: {
        'leaf-sway': 'sway 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        }
      }
    },
  },
  plugins: [],
}
