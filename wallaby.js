var wallabyWebpack = require('wallaby-webpack');

var webpackConfig = require('./webpack.config');
webpackConfig.entry = './test/rxvm.ts';
webpackConfig.output = null;

var wallabyPostprocessor = wallabyWebpack(webpackConfig);

module.exports = function(wallaby) {
  return {
    files: [
      { pattern: 'src/**/*.ts', load: false }
    ],

    tests: [
      { pattern: 'test/**/*Spec.ts', load: false }
    ],

    testFramework: 'mocha',

    postprocessor: wallabyPostprocessor,

    setup: function() {
      // required to trigger test loading
      window.__moduleBundler.loadTests();
    },

    debug: false
  };
};
