// tailwind.config.cjs
const cypressCSS = require('@cypress-design/css')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [cypressCSS.TailwindConfig()],
  corePlugins: {
    preflight: false, // disable Tailwind's reset
  },
  content: {
    files: [
      './src/**/*.{js,ts,jsx,tsx}',
      './docs/**/*.mdx',
      './node_modules/@cypress-design/react-*/dist/*.mjs',
      './node_modules/@cypress-design/react-*/dist/*.css',
    ],
    extract: ['mdx', 'js', 'ts', 'jsx', 'tsx'].reduce((acc, ext) => {
      acc[ext] = cypressCSS.TailwindIconExtractor
      return acc
    }, {}),
  },
  darkMode: ['class', '[data-theme="dark"]'], // hooks into docusaurus' dark mode settings
}
