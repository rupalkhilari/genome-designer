var path = require('path');
var express = require('express');
var webpack = require('webpack');
var morgan = require('morgan');
var config = require('./webpack.config.dev');
var DEFAULT_PORT = 3000;
var port = parseInt(process.argv[2]) || process.env.PORT ||  DEFAULT_PORT;
var hostname = '0.0.0.0';

var router = require('api');
router.init();

var app = express();
var compiler = webpack(config);

app.listen(port, hostname, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Building, will serve at http://' + hostname + ':' + port);
});

module.exports = app;