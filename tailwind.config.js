/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'white-50': '#f0f6ff',
        'black-50': '#171923',
        'black-100': '#0f1117',
        'black-200': '#070b14',
        'blue-50': '#a3c9ff',
        'blue-100': '#00d4ff',
      },
      animation: {
        'glitch': 'glitch 5s infinite',
        'scan': 'scan 3s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s steps(1) infinite',
        'loading': 'loading 1.5s ease-in-out forwards',
      },
      keyframes: {
        glitch: {
          '0%, 5%, 10%': { opacity: 0.1 },
          '1%, 6%, 11%': { opacity: 0.6 },
          '2%, 7%, 12%': { opacity: 0.1 },
          '3%, 8%, 13%': { opacity: 0.8 },
          '4%, 9%, 14%': { opacity: 0.1 },
          '15%, 100%': { opacity: 0 },
        },
        scan: {
          '0%': { top: '0%' },
          '50%': { top: '95%' },
          '100%': { top: '0%' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        loading: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      gridTemplateColumns: {
        '52': 'repeat(52, minmax(0, 1fr))',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
      },
      borderRadius: {
        'inherit': 'inherit',
      },
    },
  },
  plugins: [],
} 