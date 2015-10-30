var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var port = 3000;

var app = express();
var apiRouter = express.Router();
var compiler = webpack(config);


// Register Hotloading Middleware
// --------------------------

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));


// Register API middleware
// --------------------------
app.use('/api', apiRouter);

//this is a stub. this should go in its own directory (/api/ maybe?)
apiRouter.get('/project', function (req, res) {
  res.send('yup');
});

// Register Client Requests, delegate routing to client
// --------------------------

//so that any routing is delegated to the client
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'src/index.html'));
});

app.listen(port, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Building, will serve at http://localhost:' + port);
});
