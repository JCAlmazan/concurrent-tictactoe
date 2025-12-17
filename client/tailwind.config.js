/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#06066b',
        'neon-blue': '#0fd',
        'neon-purple': '#f6f',
      },
      boxShadow: {
        'neon-x': '0 3px 2px rgba(0, 0, 70, .4), 0 4px 35px #0fd, inset 0 -5px 1px #00e2c0',
        'neon-o': '0 3px 2px rgba(0, 0, 70, .4), 0 4px 35px #f6f, inset 0 -5px 1px #e047ff',
      }
    },
  },
  plugins: [],
}
