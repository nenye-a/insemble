module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: ['react-hot-loader/babel', '@babel/plugin-proposal-class-properties'],
  env: {
    test: {
      // For the test environment (jest) we need typescript support.
      presets: ['@babel/preset-env', '@babel/typescript', '@babel/preset-react'],
    },
  },
};
