const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../../libs/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': 'rgb(16, 20, 36)',
        'light-blue': 'rgb(37, 48, 91)',
      },
    }
  },
  safelist: [
    'bg-slate-300',
    'bg-slate-700',
  ],
  plugins: [],
};
