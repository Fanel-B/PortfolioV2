const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  content: ['./app/**/*.tsx', './components/**/*.tsx', './lib/**/*.ts', './data/**/*.ts'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-akronim)', 'cursive'],
        accent: ['var(--font-righteous)', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        green: colors.emerald,
        pro: {
          bg: '#0A0E1A',
          surface: '#0D1B3E',
          surface2: '#1E3A5F',
          accent: '#3B82F6',
          text: '#E2E8F0',
        },
        perso: {
          bg: '#FFF8F0',
          accent: '#FF7043',
          accent2: '#FFAB76',
          accent3: '#60B4F0',
          text: '#3D2B1F',
        },
      },
    },
  },
  plugins: [],
};
