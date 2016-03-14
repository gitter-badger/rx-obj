const path = require('path');
const webpack = require('webpack');

const defines = {
  DEBUG: false,
  RELEASE: false,
  TEST: false,
  // we want to specifically use snake case for the defines
  // eslint-disable-next-line id-match
  WEBPACK_DEV_SERVER: false,
};

module.exports = {
  entry: [
    path.join(__dirname, 'src', 'rx.obj.ts'),
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'rx.obj.js',
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
