/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-navy': '#0A192F',
        'juicy-green': '#58CC02',
        'panic-pink': '#FF4B4B',
        'panic-orange': '#FF9600',
        'electric-cyan': '#00C3FF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
      },
    },
  },
  plugins: [],
}
