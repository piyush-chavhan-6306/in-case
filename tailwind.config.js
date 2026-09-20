/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfbf7',
          100: '#f8f4eb',
          200: '#eee5d3',
          300: '#e3d2b6',
        },
        ivory: '#fbf8f2',
        warmPeach: '#fdede2',
        warmGold: '#f59e0b',
        warmAmber: '#d97706',
        warmDark: '#1c1917',
        warmCard: 'rgba(255, 255, 255, 0.16)',
        navy: {
          950: '#060a14',
          900: '#0b132b',
          800: '#152144',
          700: '#1c2d5a',
          600: '#273f7c',
        },
        accent: {
          gold: '#f59e0b',
          amber: '#f39a36',
          sky: '#38bdf8',
          cyan: '#06b6d4',
          coral: '#f43f5e',
          emerald: '#10b981',
          lavender: '#a78bfa'
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        'organic': '2.25rem',
        'bubble': '2.5rem',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'sweep': 'sweep 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        sweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        }
      }
    },
  },
  plugins: [],
}
