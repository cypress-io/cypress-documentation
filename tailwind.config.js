// const colors = require('windicss/colors')
// const typography = require('windicss/plugin/typography')

module.exports = {
  /**
   * All utilities will be marked with !important
   * @see https://tailwindcss.com/docs/configuration#important
   */
  important: false,
  // plugins: [require('@tailwindcss/forms')],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        navy: {
          DEFAULT: '#17202c',
        },
        green: '#04c38d',
        cyGreen: '#1dbe89',
        darkGreen: '#0b2d41',
        blue: '#36c5ff',
        yellow: '#e6ff1e',
        violet: '#b163ff',
        lightGray: '#f9fcfb',
      },
      textColor: {
        blue: '#1079c3',
      },
      spacing: {
        sidebar: '290px',
      },
    },
  },
}
