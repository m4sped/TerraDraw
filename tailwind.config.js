/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src//*.{js,jsx,ts,tsx}"], 
  theme: {
    extend: {
      colors: {
        spotify: {
          green: "#1DB954",
          black: "#191414",
          gray: "#121212",
        },
      },
    },
  },
  plugins: [],
};