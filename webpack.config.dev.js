var path    = require('path');
var webpack = require('webpack');
var webpackBase = require('./webpack.config.base');

module.exports = Object.assign({}, webpackBase, {
  devtool: 'cheap-module-eval-source-map',
  entry  : [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output : {
    path      : path.join(__dirname, 'dist'),
    filename  : 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('dev')
      }
    })
  ],
  module : {
    loaders: [
      {
        test   : /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test  : /\.css$/,
        loader: 'style-loader/useable!css-loader!postcss-loader'
      }
    ]
  }
});
