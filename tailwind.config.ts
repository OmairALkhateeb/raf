import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf9ef',
          100: '#f9f0d6',
          200: '#f1ddab',
          300: '#e8c476',
          400: '#dea943',
          500: '#C9A84C',
          600: '#b08a30',
          700: '#8d6a26',
          800: '#745526',
          900: '#604624',
          950: '#362410',
        },
        brown: {
          50:  '#fdf6f3',
          100: '#f9ece5',
          200: '#f2d5c8',
          300: '#e8b49f',
          400: '#d98b6f',
          500: '#cc6b48',
          600: '#be5335',
          700: '#9e412a',
          800: '#823727',
          900: '#6c3124',
          DEFAULT: '#2D1F1F',
          dark: '#1a1010',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          dark: '#F5F0E8',
          darker: '#EDE5D5',
        },
        oman: {
          red: '#DB1B1B',
          green: '#008000',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        arabic: ['var(--font-cairo)', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(100%)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        slideInLeft: { from: { opacity: '0', transform: 'translateX(-100%)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'product': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'product-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'header': '0 2px 20px rgba(0, 0, 0, 0.06)',
        'modal': '0 25px 50px rgba(0, 0, 0, 0.25)',
        'gold': '0 4px 14px rgba(201, 168, 76, 0.4)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E8D5A3 50%, #C9A84C 100%)',
        'hero-overlay': 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
