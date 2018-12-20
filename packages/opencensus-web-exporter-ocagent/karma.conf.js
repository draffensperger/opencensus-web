module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      {pattern: 'src/**/*.ts'},
      {pattern: 'test/**/*.ts'},
    ],
    preprocessors: {
      'src/**/*.ts': ['karma-typescript', 'coverage'],
      'test/**/*.ts': ['karma-typescript'],
    },
    karmaTypescriptConfig: {
      'extends': './tsconfig.json',
    },
    reporters: ['progress', 'coverage', 'karma-typescript'],
    browsers: ['ChromeHeadless'],
  });
};
