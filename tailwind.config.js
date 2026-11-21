/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#000000',
          card: 'rgba(28, 28, 30, 0.75)',
          cardLight: 'rgba(255, 255, 255, 0.85)',
          gray1: '#8E8E93',
          gray2: '#636366',
          gray3: '#48484A',
          gray4: '#3A3A3C',
          gray5: '#2C2C2E',
          gray6: '#1C1C1E',
          red: '#FF453A',
          orange: '#FF9F0A',
          yellow: '#FFD60A',
          green: '#30D158',
          mint: '#63E6E2',
          teal: '#40C8E0',
          cyan: '#64D2FF',
          blue: '#0A84FF',
          indigo: '#5E5CE6',
          purple: '#BF5AF2',
          pink: '#FF375F',
          ringCalories: '#FA114F',
          ringProtein: '#BAFF1A',
          ringCarbs: '#00D2FF',
          ringFat: '#FF9500'
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif'
        ]
      },
      backdropBlur: {
        'xs': '2px',
        'apple': '25px',
        'glass': '40px'
      },
      boxShadow: {
        'apple': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'apple-light': '0 8px 30px rgba(0, 0, 0, 0.08)',
        'glow-calories': '0 0 25px rgba(250, 17, 79, 0.45)',
        'glow-protein': '0 0 25px rgba(186, 255, 26, 0.45)',
        'glow-carbs': '0 0 25px rgba(0, 210, 255, 0.45)',
      },
      animation: {
        'scan': 'scan 2.5s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0.9' },
          '50%': { transform: 'translateY(280px)', opacity: '0.4' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
