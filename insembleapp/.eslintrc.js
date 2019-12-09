module.exports = {
  extends: 'react-app',
  plugins: ['babel', 'jest', 'eslint-comments', 'react-hooks'],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  rules: {
    // TODO: Re-enable the following rule after we fix the code.
    'no-unused-vars': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
