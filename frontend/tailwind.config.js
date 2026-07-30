/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#050505',
        surface: {
          dark: '#111111',
          card: '#161616',
          border: '#222222',
          borderHover: '#333333',
        },
        coral: {
          DEFAULT: '#FF6B50',
          hover: '#E55A40',
          light: '#FF8570',
          subtle: 'rgba(255, 107, 80, 0.12)',
        },
        editorial: {
          text: '#ebebeb',
          muted: '#888888',
          subtle: '#666666',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        ultra: '0.35em',
      },
    },
  },
  plugins: [],
};
