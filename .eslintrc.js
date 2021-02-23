module.exports = {
  plugins: ['cypress', '@cypress/dev'],
  extends: [
    'plugin:vue/vue3-recommended',
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
