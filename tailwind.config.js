/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#faf8f4',
          100: '#f5f0e8',
          200: '#ede4d4',
          300: '#e0d4be',
          400: '#c8b89a',
          500: '#b09070',
          600: '#8b6f4e',
          700: '#6b5038',
          800: '#4a3525',
          900: '#2a1a10',
        },
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
