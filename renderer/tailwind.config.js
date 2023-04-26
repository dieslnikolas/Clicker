const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './renderer/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    colors: {
      // use colors only specified
      white: colors.white,
      gray: colors.gray,
      blue: colors.blue,
    },
    extend: {},
  },
  plugins: [],
};