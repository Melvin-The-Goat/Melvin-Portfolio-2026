/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dev-dark': '#0a0a0a',
        'dev-gray': '#1a1a1a',
      },
    },
  },
  plugins: [],
}

