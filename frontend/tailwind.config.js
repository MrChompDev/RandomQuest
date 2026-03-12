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
        'quest-blue': '#2F6BFF',
        'quest-blue-light': '#5B8CFF',
        'quest-blue-dark': '#1E4CCB',
        'adventure-gold': '#F3A847',
        'adventure-gold-dark': '#D88B2C',
        'deep-navy': '#18223C',
        'sky-mist': '#EEF2F8',
        'success-green': '#16A34A',
        'success-green-dark': '#0E7A36',
      },
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'body': ['Manrope', 'sans-serif'],
        'code': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'level-up': 'levelUp 1s ease-out forwards',
        'xp-fill': 'xpFill 0.8s ease-out forwards',
      },
      keyframes: {
        levelUp: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        xpFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--target-width)' },
        },
      },
    },
  },
  plugins: [],
}
