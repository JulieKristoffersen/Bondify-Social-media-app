/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}", "!./node_modules/**/*"],
  theme: {
    extend: {
      colors: {
        teal: {
          100: '#e0f7f4',
          500: '#26a69a',
          700: '#00796b',
        },
        sky: {
          500: '#29b6f6',
        },
      },
    },
  },
  plugins: [],
}
