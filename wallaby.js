/* global  window */

var path = require('path');
var wallabyWebpack = require('wallaby-webpack');

var webpackConfig = require('./webpack.config');
webpackConfig.entry = path.join(__dirname, 'test', 'rx.obj.ts');
webpackConfig.output = null;

var wallabyPostprocessor = wallabyWebpack(webpackConfig);

module.exports = function() {
  return {
    files: [
      { pattern: 'src/**/*.ts', load: false }
    ],

    tests: [
      { pattern: 'test/**/*.spec.ts', load: false }
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
