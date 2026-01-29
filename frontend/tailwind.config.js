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
        background: '#121212',
        surface: '#1E1E1E',
        'surface-light': '#2D2D2D',
        primary: '#BB86FC',
        'primary-dark': '#9A67EA',
        accent: '#03DAC6',
        error: '#CF6679',
        'on-background': '#E1E1E1',
        'on-surface': '#E1E1E1',
        'on-primary': '#000000',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
