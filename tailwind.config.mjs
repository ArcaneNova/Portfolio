/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black-100': '#100d25',
        'black-200': '#090325',
        'white-100': '#f3f3f3',
        'blue-100': '#00d4ff',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'reverse-spin': 'reverse-spin 8s linear infinite',
        'float-down': 'floatDown 10s linear infinite',
        'scan': 'scan 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'reverse-spin': {
          from: {
            transform: 'rotate(360deg)'
          },
        },
        floatDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        scan: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(100vh)' },
          '100%': { transform: 'translateY(0)' }
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}; 