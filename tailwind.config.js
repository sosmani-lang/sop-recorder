/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
    "./src/renderer/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        danger: "#ef4444",
        success: "#22c55e"
      }
    }
  },
  plugins: []
}
