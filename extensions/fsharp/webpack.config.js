var path = require('path');
var webpack = require('webpack');

module.exports = {
	extry: './main',
	output: {
		filename: 'index.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}
		]
	}
}