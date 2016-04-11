import path from 'path';
import fs from 'fs';
import express from 'express';
import webpack from 'webpack';
import morgan from 'morgan';
import config from './../webpack.config.dev.js';

import dataRouter from './data/index';
import fileRouter from './file/index';
import extensionsRouter from './extensions/index';

import computeRouter from '../plugins/compute/api';
import importRouter from '../plugins/convert/import';
import exportRouter from '../plugins/convert/export';
import searchRouter from '../plugins/search/search';

const DEFAULT_PORT = 3000;
const port = parseInt(process.argv[2], 10) || process.env.PORT || DEFAULT_PORT;
const hostname = '0.0.0.0';

const ROOT = path.dirname(__dirname);
const app = express();
const compiler = webpack(config);

//error logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use((err, req, res, next) => {
    console.log('hit error logging middleware', err, req, res, next);
    if (err) {
      console.error(err);
      if (res.headersSent) {
        return next(err);
      }
      res.status(502).send(err);
    }
    return next();
  });
}

//HTTP logging middleware
app.use(morgan('dev'));

// view engine setup
app.set('views', path.join(__dirname, '../src'));
app.set('view engine', 'jade');

// Register Hotloading Middleware
// ----------------------------------------------------

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}));
app.use(require('webpack-hot-middleware')(compiler));

// Register API middleware
// ----------------------------------------------------

// insert some form of user authentication
// the auth routes are currently called from the client and expect JSON responses
if (process.env.BIO_NANO_AUTH) {
  console.log("real user authentication enabled");
  var initAuthMiddleware = require('bio-user-platform').initAuthMiddleware;

  // TODO load a custom configuration here
  // disable all redirects
  var authConfig = {
    logoutLanding: false,
    loginLanding: false,
    loginFailure: false,
    resetForm: "/homepage/reset",
    apiEndPoint: process.env.API_END_POINT || "http://localhost:8080/api",
  };
  app.use(initAuthMiddleware(authConfig));
} else {
  app.use(require('cookie-parser')());
  // import the mocked auth routes
  app.use(require('./auth/local').mockUser);
  const authRouter = require('./auth/local').router;
  app.use('/auth', authRouter);
}

//primary routes
app.use('/data', dataRouter);
app.use('/file', fileRouter);
app.use('/extensions', extensionsRouter);

//hardwired extensions
app.use('/compute', computeRouter);
app.use('/import', importRouter);
app.use('/export', exportRouter);
app.use('/search', searchRouter);

// Register Client Requests, delegate routing to client
// ----------------------------------------------------

//Static Files
app.use('/images', express.static(path.join(__dirname, '../src/images')));

app.get('/version', (req, res) => {
  try {
    const version = fs.readFileSync(path.join(ROOT, 'VERSION'));
    res.send(version);
  } catch (ignored) {
    res.send('Missing VERSION file');
  }
});

//so that any routing is delegated to the client
app.get('*', (req, res) => {
  res.render('index.jade', req.user);
});

//start the server by default
app.listen(port, hostname, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Building, will serve at http://' + hostname + ':' + port);
});

export default app;
