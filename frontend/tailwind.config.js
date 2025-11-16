/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#DFFFE2',
          100: '#A8E6A1',
          200: '#6FCF97',
          300: '#6FCF97',
          400: '#6FCF97',
          500: '#6FCF97',
          600: '#5AB87F',
          700: '#4A9F6F',
          800: '#3A865F',
          900: '#2F4F3E',
        },
        wellness: {
          light: '#DFFFE2',
          pastel: '#A8E6A1',
          main: '#6FCF97',
          dark: '#2F4F3E',
          forest: '#2F4F3E',
        },
        background: {
          start: '#E8F7EF',
          end: '#FFFFFF',
        }
      },
      borderRadius: {
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(111, 207, 151, 0.1), 0 2px 4px -1px rgba(111, 207, 151, 0.06)',
        'gentle': '0 10px 15px -3px rgba(111, 207, 151, 0.1), 0 4px 6px -2px rgba(111, 207, 151, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'scale-up': 'scaleUp 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
    },
  },
  plugins: [],
}

