module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 8,
    sourceType: 'module',
  },
  plugins: ['cypress', '@cypress/dev', 'jest', 'markdown'],
  extends: [
    'plugin:vue/recommended',
    'plugin:@cypress/dev/general',
    'plugin:cypress/recommended',
    'prettier',
    'plugin:markdown/recommended',
  ],
  env: {
    es6: true,
    node: true,
    'cypress/globals': true,
    'jest/globals': true,
  },
  overrides: [
    {
      files: ['**/*.md/*.js'],
      rules: {
        'cypress/no-unnecessary-waiting': 'off',
        'cypress/no-assigning-return-values': 'off',
        'no-console': 'off',
        'no-debugger': 'off',
      },
    },
  ],
}
