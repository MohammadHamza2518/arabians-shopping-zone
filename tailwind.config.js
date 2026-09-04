/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arabian: {
          dark: '#032219',
          green: '#064e3b',
          emerald: '#047857',
          lightGreen: '#ecfdf5',
          gold: '#d97706',
          lightGold: '#fef3c7',
          richGold: '#f59e0b',
          darkGold: '#92400e',
          cream: '#faf8f5',
          sand: '#f5f0e6',
          card: '#ffffff',
          darkCard: '#09362a'
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        arabic: ['"Amiri"', 'serif']
      },
      boxShadow: {
        'gold': '0 4px 20px -2px rgba(217, 119, 6, 0.25)',
        'emerald': '0 4px 25px -2px rgba(6, 78, 59, 0.35)',
        'soft': '0 10px 30px -5px rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [],
}
