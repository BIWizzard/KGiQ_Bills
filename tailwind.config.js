/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media', // Add this line - uses OS preference
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { // Your colors are here
        'kg-blue': '#304c72',
        'kg-gray': '#59708e',
        'kg-yellow': '#ffd166',
        'kg-green': '#c5e6a6',
        'kg-green2': '#bdd2a6',
        'kg-ash': '#b9bea5',
        'kg-ash2': '#a7aaa4',
        'kg-wine': '#733041',
      },
      fontFamily: { // Add this placeholder font section
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
    },
  },
  plugins: [],
}