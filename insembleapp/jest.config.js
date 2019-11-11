'use strict';

module.exports = {
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    'node_modules/*',
  ],
  modulePaths: [
    // 'frontend',
    // 'frontend/js', // may not be useful. TODO: Remove front/js tags
    // 'frontend/js/app', // may not be useful anymore
    'frontend/src',
    'frontend/src/app',
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  setupFiles: [
    './jest-setup.js',
  ],
  collectCoverageFrom: [
    // 'frontend/js/**/*.{js,jsx}', // may not be useful anymore
    'frontend/src/**/*.{js,jsx}',
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
