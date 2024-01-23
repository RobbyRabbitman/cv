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
    plugin(function ({ addUtilities, addBase }) {
      addBase({
        '@font-face': {
          fontFamily: 'Material Symbols Outlined',
          fontStyle: 'normal',
          fontWeight: '100 700',
          src: "url(https://fonts.gstatic.com/s/materialsymbolsoutlined/v156/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsLjBuVY.woff2) format('woff2')",
        },
      });

      addUtilities({
        '.focus-ring': {
          '@apply focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-900 focus-visible:dark:outline-white':
            {},
        },
        '.icon': {
          fontFamily: 'Material Symbols Outlined',
          fontWeight: 'normal',
          fontStyle: 'normal',
          fontSize: '1.5rem',
          lineHeight: '1',
          letterSpacing: 'normal',
          textTransform: 'none',
          display: 'inlineBlock',
          whiteSpace: 'nowrap',
          wordWrap: 'normal',
          direction: 'ltr',
        },
        '.control': {
          '@apply outline-none appearance-none border-opacity-25 border-solid border-2 border-primary-500 rounded-md hover:bg-primary-200 hover:dark:bg-primary-800 dark:focus-within:border-white':
            {},
        },
        '.select-with-icon': {
          '@apply outline-none appearance-none py-2 pl-10 pr-8': {},
        },
        '.select-icon': {
          '@apply icon absolute top-2 left-2 pointer-events-none': {},
        },
        '.select-arrow-icon': {
          '@apply icon absolute top-2 right-2 pointer-events-none': {},
        },
      });
    }),
  ],
};
