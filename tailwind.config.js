/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#252422',
        secondary: '#403d39',
        font: '#e9edc9',
        point: '#eb5e28',
        button: '#8a817c',
        error: '#e5383b',
      },
    },
  },
  plugins: [],
}