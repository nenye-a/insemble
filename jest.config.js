module.exports = {
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/frontend/src/__mocks__/fileMock.js',
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: ['node_modules/*'],
  modulePaths: [
    // 'frontend',
    // 'frontend/js', // may not be useful. TODO: Remove front/js tags
    // 'frontend/js/app', // may not be useful anymore
    'frontend/src',
    'frontend/src/app',
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: ['./jest-setup.js'],
  collectCoverageFrom: [
    // 'frontend/js/**/*.{js,jsx}', // may not be useful anymore
    'frontend/src/**/*.{ts,tsx,js,jsx}',
  ],
  coveragePathIgnorePatterns: [
    //  Section here may note be needed anymore
    // 'frontend/js/store.js',
    // 'frontend/js/index.js',
    // 'frontend/js/jquery-index.js',
    // 'frontend/js/constants/*',
    // 'frontend/js/pages/*',
    // 'frontend/js/tests/*',
    //  Section above maynote be needed anymore
    'frontend/src/store.js',
    'frontend/src/index.js',
    'frontend/src/jquery-index.js',
    'frontend/src/assets/*',
    'frontend/src/components/*',
    'frontend/src/data/*',
    'frontend/src/flux/*',
    'frontend/src/images/*',
    'frontend/src/layouts/*',
    'frontend/src/styles/*',
    'frontend/src/views/*',
    'frontend/src/tests/*',
  ],
  coverageThreshold: {
    global: {
      statements: 10,
    },
  },
};
