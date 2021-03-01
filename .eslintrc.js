module.exports = {
  parser: "vue-eslint-parser",
  parserOptions: {
    "parser": "babel-eslint",
    "ecmaVersion": 8,
    "sourceType": "module"
  },
  plugins: ['cypress', '@cypress/dev'],
  extends: [
    'plugin:vue/recommended',
    'plugin:@cypress/dev/general',
    'plugin:cypress/recommended',
    'prettier',
  ],
  env: {
    es6: true,
    node: true,
    'cypress/globals': true,
  },
}
