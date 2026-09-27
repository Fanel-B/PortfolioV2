const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  content: ['./app/**/*.tsx', './components/**/*.tsx', './lib/**/*.ts', './data/**/*.ts'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', ...defaultTheme.fontFamily.sans],
        heading: ['var(--font-syne)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        green: colors.emerald,
        // Côté pro : ciel de nuit, bleu scintillant
        pro: {
          bg: '#0A0E1A',
          surface: '#101A33',
          surface2: '#1E2D52',
          accent: '#8ECDF8',
          lavande: '#B8A9F5',
          menthe: '#9EE6CF',
          text: '#E2E8F0',
        },
        // Côté perso : chambre noire, lumière chaude
        perso: {
          bg: '#0F0B12',
          surface: '#1A1420',
          accent: '#F2B880',
          accent2: '#E8A0BF',
          text: '#F3E9DC',
        },
      },
      boxShadow: {
        glow: '0 0 24px rgba(142, 205, 248, 0.35)',
        'glow-lg': '0 0 48px rgba(142, 205, 248, 0.45)',
      },
    },
  },
  plugins: [],
};
