module.exports = {
  /**
   * All utilities will be marked with !important
   * @see https://tailwindcss.com/docs/configuration#important
   */
  darkMode: 'class',
  important: false,
  plugins: [require('@tailwindcss/forms')],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        navy: {
          DEFAULT: '#17202c',
        },
        lightGreen: '#cff1e6',
        green: '#04c38d',
        cyGreen: '#1dbe89',
        contrastGreen: '#127458',
        darkGreen: '#0b2d41',
        blue: '#36c5ff',
        yellow: '#e6ff1e',
        violet: '#b163ff',
        lightGray: '#f9fcfb',
        indigo: {
          50: '#F0F1FF',
          100: '#DADDFE',
          500: '#4956E3',
          900: '#1C236D',
        },
      },
      textColor: {
        blue: '#1079c3',
        green: '#127458',
        black: 'rgb(46, 49, 56)',
      },
      spacing: {
        sidebar: '290px',
      },
    },
  },
}
