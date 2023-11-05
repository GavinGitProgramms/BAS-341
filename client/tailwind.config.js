/** @type {import('tailwindcss').Config} */

import daisyui from 'daisyui'

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // add paths to all of your components so Tailwind can tree-shake unused styles in production
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['night'],
  },
}
