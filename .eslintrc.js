module.exports = {
  plugins: ['cypress', '@cypress/dev'],
  extends: [
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
