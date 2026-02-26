/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d0d9e6',
          300: '#a6b7cc',
          400: '#7a8fad',
          500: '#4a5f7a',
          600: '#2e405b',
          700: '#1f2e45',
          800: '#141f30',
          900: '#0a1220',
        },
        gold: {
          500: '#c9a227',
          600: '#a87f1f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}