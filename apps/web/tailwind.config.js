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
      disabled: colors.gray,
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
          '@apply focus-visible:focus-ring': {},
        },
      });

      addUtilities({
        '.focus-ring': {
          '@apply rounded-sm outline outline-2 outline-offset-4 outline-secondary-500 dark:outline-secondary-500':
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

        '.text-primary': {
          '@apply text-primary-500 dark:text-primary-400': {},
        },

        '.bg-primary': {
          '@apply bg-white dark:bg-primary-900': {},
        },

        '.text-secondary': {
          '@apply text-secondary-500 dark:text-secondary-400': {},
        },

        '.border-secondary': {
          '@apply hover:border-secondary-300 hover:dark:border-secondary-600':
            {},
        },

        '.divider': {
          '@apply h-0.5 bg-opacity-25 bg-primary-500': {},
        },

        '.border-primary': {
          '@apply border-opacity-25 border-solid border-2 border-primary-500 rounded-md':
            {},
        },

        '.control-hover': {
          '@apply border-secondary text-secondary bg-secondary-100 dark:bg-secondary-950':
            {},
        },

        '.control-size': {
          '@apply h-11 inline-flex gap-1': {},
        },

        '.control-border': {
          '@apply border-primary': {},
        },

        '.control-focus': {
          '@apply border-secondary-500 border-secondary-400': {},
        },

        '.control': {
          '@apply control-size outline-none appearance-none bg-inherit control-border hover:control-hover focus-within:control-focus':
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

        '.input': {
          '@apply control p-2 placeholder:italic': {},
        },
      });
    }),
  ],
};
