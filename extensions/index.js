var path = require('path');
var express = require('express');
var DEFAULT_PORT = 3000;
var port = parseInt(process.argv[2]) || process.env.PORT ||  DEFAULT_PORT;
var hostname = '0.0.0.0';

var router = require('./api');
router.init();

var app = express();

app.listen(port, hostname, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Building, will serve at http://' + hostname + ':' + port);
});

app.use('/', router);

module.exports = app;