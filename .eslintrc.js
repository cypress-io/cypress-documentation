module.exports = {
  ignorePatterns: ['_cypress-nextjs-docs'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 8,
    sourceType: 'module',
  },
  plugins: ['cypress', '@cypress/dev', 'jest'],
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
    'jest/globals': true,
  },
}
