module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['eslint-comments', 'react', 'react-hooks', 'prettier'],
  extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'prettier/@typescript-eslint'],
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

    // React (eslint-plugin-react)
    'react/jsx-key': 'warn',
    'react/jsx-no-comment-textnodes': 'warn',
    'react/jsx-no-duplicate-props': 'warn',
    'react/jsx-no-target-blank': 'warn',
    'react/jsx-no-undef': 'warn',
    'react/jsx-uses-react': 'warn',
    'react/jsx-uses-vars': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react/no-unknown-property': 'warn',
    'react/react-in-jsx-scope': 'error',
    'react/require-render-return': 'warn',
    'react/self-closing-comp': 'warn',

    // React (eslint-plugin-react-hooks)
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Custom
    'array-callback-return': 'warn',
    curly: 'warn',
    'dot-notation': 'warn',
    'eol-last': 'warn',
    eqeqeq: ['error', 'always', { null: 'never' }],
    'guard-for-in': 'warn',
    'no-alert': 'warn',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-duplicate-imports': ['warn', { includeExports: true }],
    'no-floating-decimal': 'warn',
    'no-new': 'warn',
    'no-proto': 'warn',
    'no-return-assign': 'warn',
    'no-underscore-dangle': ['warn', { allowAfterThis: true }],
    'no-unneeded-ternary': 'warn',
    'one-var': ['warn', 'never'],
    'prefer-arrow-callback': 'warn',
    'prefer-const': 'off',
    radix: 'warn',
    yoda: 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
