module.exports = {
  extends: 'react-app',
  plugins: ['babel', 'jest', 'eslint-comments', 'react-hooks'],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  rules: {
    'no-unused-vars': 1,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
