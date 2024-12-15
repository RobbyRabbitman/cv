const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'src/**/*.{html,ts}',
    ...createGlobPatternsForDependencies(__dirname),
  ],
};
