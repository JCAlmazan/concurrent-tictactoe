/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#06066b",
        glass: "hsla(0, 0%, 100%, .1)",
        x: "#0fd",
        o: "#f6f",
      },
      boxShadow: {
        x: "0 3px 2px rgba(0,0,70,.4), 0 4px 35px #0fd, inset 0 -5px 1px #00e2c0",
        o: "0 3px 2px rgba(0,0,70,.4), 0 4px 35px #f6f, inset 0 -5px 1px #e047ff",
      },
    },
  },
  plugins: [],
};
