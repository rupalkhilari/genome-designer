var path    = require('path');
var webpack = require('webpack');
var webpackBase = require('./webpack.config.base.js');

module.exports = Object.assign({}, webpackBase, {
  devtool: 'source-map',
  entry  : [
    './src/index'
  ],
  output : {
    path      : path.join(__dirname, 'dist'),
    filename  : 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module : {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test   : /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test  : /\.css$/,
        loader: 'css-loader!postcss-loader'
      }
    ]
  }
});
