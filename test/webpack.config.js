var path = require('path');
var webpack = require('webpack');

var defines = {
  DEBUG: false,
  RELEASE: false,
  TEST: true,
  WEBPACK_DEV_SERVER: false
};

module.exports = {
  entry: [
    path.join(__dirname, 'rx.obj.tests.ts')
  ],
  output: {
    path: path.join(__dirname, '..', 'build', 'test'),
    filename: 'rx.obj.tests.js'
  },
  externals: {
  },
  devtool: 'sourcemap',
  plugins: [
    new webpack.DefinePlugin(defines)
  ],
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts' }
    ]
  },
  resolve: {
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js'],
    alias: {
    }
  },
  failOnError: true
};
