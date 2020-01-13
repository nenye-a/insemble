module.exports = {
  extends: 'react-app',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['eslint-comments', 'react-hooks', '@typescript-eslint'],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  rules: {
    // TypeScript (@typescript-eslint/eslint-plugin)
    '@typescript-eslint/array-type': ['error', { default: 'generic' }],
    '@typescript-eslint/camelcase': ['error', { properties: 'never' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Boolean: { message: 'Use boolean instead', fixWith: 'boolean' },
          Number: { message: 'Use number instead', fixWith: 'number' },
          String: { message: 'Use string instead', fixWith: 'string' },
          Symbol: { message: 'Use symbol instead', fixWith: 'symbol' },
        },
      },
    ],

    // ESLint (eslint-plugin-eslint-comments)
    'eslint-comments/no-unused-disable': 'warn',

    'no-unused-vars': 1,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
