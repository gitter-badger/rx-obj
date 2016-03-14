const path = require('path');
const webpack = require('webpack');

const defines = {
  DEBUG: false,
  RELEASE: false,
  TEST: true,
  // we want to specifically use snake case for the defines
  // eslint-disable-next-line id-match
  WEBPACK_DEV_SERVER: false,
};

module.exports = {
  entry: [
    path.join(__dirname, 'rx.obj.tests.ts'),
  ],
  output: {
    path: path.join(__dirname, '..', 'build', 'test'),
    filename: 'rx.obj.tests.js',
  },
  externals: {
  },
  devtool: 'sourcemap',
  plugins: [
    new webpack.DefinePlugin(defines),
  ],
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts' },
    ],
  },
  resolve: {
    extensions: [ '', '.ts', '.webpack.js', '.web.js', '.js' ],
    alias: {
    },
  },
  failOnError: true,
};
