const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        navy: {
          DEFAULT: "#17202c",
        },
        lightGreen: "#cff1e6",
        green: "#04c38d",
        cyGreen: "#1dbe89",
        contrastGreen: "#127458",
        darkGreen: "#0b2d41",
        blue: "#36c5ff",
        yellow: "#e6ff1e",
        violet: "#b163ff",
        lightGray: "#f9fcfb",
      },
      textColor: {
        blue: "#1079c3",
        green: "#127458",
        black: "rgb(46, 49, 56)",
      },
      spacing: {
        sidebar: "290px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    // https://github.com/tailwindlabs/tailwindcss-aspect-ratio
    require("@tailwindcss/aspect-ratio"),
    // https://github.com/tailwindlabs/tailwindcss-forms
    require("@tailwindcss/forms"),
    // https://github.com/tailwindlabs/tailwindcss-typography
    require("@tailwindcss/typography"),
  ],
}
