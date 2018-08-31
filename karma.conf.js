// module.exports = function(config) {
//   config.set({
//     frameworks: ['jasmine', 'commonjs'],
//     files: [
//       {pattern: 'build/src/**/*.js'},
//       {pattern: 'build/test/**/*.js'},
//     ],
//     preprocessors: {'**/*.js': ['commonjs']},
//     reporters: ['progress'],
//     browsers: ['ChromeHeadless'],
//   });
// };

// karma-typescript is problematic when there are compiler errors as
// it quits karma.
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
      'extends': './node_modules/gts/tsconfig-google.json',
      'compilerOptions': {
        'rootDir': '.',
        'outDir': 'build',
        'pretty': true,
        'module': 'commonjs',
        'target': 'es5',
        'lib': ['es5', 'dom', 'es6'],
        'strictNullChecks': true,
        'baseUrl': '.',
        'paths': {
          'src/*': ['./src/*'],
          'test/*': ['./test/*'],
        },
      },
      'include': ['src/**/*.ts', 'test/**/*.ts'],
      'exclude': ['node_modules'],
    },

    reporters: ['progress', 'coverage', 'karma-typescript'],
    browsers: ['ChromeHeadless'],
  });
};
