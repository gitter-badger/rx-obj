/* global  window */

const path = require('path');
const wallabyWebpack = require('wallaby-webpack');

const webpackConfig = require('./webpack.config');

webpackConfig.entry = path.join(__dirname, 'test', 'rx.obj.ts');
webpackConfig.output = null;

const wallabyPostprocessor = wallabyWebpack(webpackConfig);

module.exports = function () {
  return {
    files: [
      { pattern: 'src/**/*.ts', load: false },
    ],

    tests: [
      { pattern: 'test/**/*.spec.ts', load: false },
    ],

    testFramework: 'mocha',

    postprocessor: wallabyPostprocessor,

    setup: () => {
      // required to trigger test loading
      // eslint-disable-next-line no-underscore-dangle
      window.__moduleBundler.loadTests();
    },

    debug: false,
  };
};
