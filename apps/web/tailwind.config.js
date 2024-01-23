const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      inherit: 'inherit',
      white: colors.white,
      black: colors.black,
      primary: colors.slate,
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.control-border': {
          '@apply border-opacity-25 border-solid border-2 border-primary-500 rounded-md focus-within:border-opacity-100 focus-within:border-white':
            {},
        },
      });
    }),
  ],
};
