/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        royal: {
          800: '#1e1b4b',
          900: '#0f172a',
        },
        saffron: {
          500: '#ff9933',
        },
      },
    },
  },
  plugins: [],
};
