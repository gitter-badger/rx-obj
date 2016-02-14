var path = require('path');
var webpack = require('webpack');

var defines = {
  DEBUG: false,
  RELEASE: false,
  TEST: false
};

module.exports = {
  entry: path.join(__dirname, 'src/rxvm.ts'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'rxvm.js'
  },
  devtool: 'sourcemap',
  externals: {
  },
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
