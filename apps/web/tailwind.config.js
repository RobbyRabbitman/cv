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
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      inherit: 'inherit',
      white: colors.white,
      black: colors.black,
      primary: colors.slate,
      secondary: colors.sky,
    },
  },
  plugins: [
    plugin(function ({ addUtilities, addBase, addComponents }) {
      addBase({
        '@font-face': {
          fontFamily: 'Material Symbols Outlined',
          fontStyle: 'normal',
          fontWeight: '100 700',
          src: "url(https://fonts.gstatic.com/s/materialsymbolsoutlined/v156/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsLjBuVY.woff2) format('woff2')",
        },

        a: {
          '@apply focus-ring': {},
        },
      });

      addUtilities({
        '.focus-ring': {
          '@apply focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary-500 focus-visible:dark:outline-secondary-500':
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
          '@apply inline-flex gap-1 outline-none appearance-none border-opacity-25 border-solid border-2 border-primary-500 rounded-md hover:text-secondary-500 hover:dark:text-secondary-400 hover:bg-secondary-100 hover:dark:bg-secondary-950 focus-within:border-secondary-500 dark:focus-within:border-secondary-400':
            {},
        },
        '.select-label': {
          '@apply control relative': {},
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

      addComponents({
        '.button': {
          '@apply font-bold control inline-flex p-2 active:translate-y-0.5': {},
        },
      });
    }),
  ],
};
