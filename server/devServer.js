import path from 'path';
import express from 'express';
import webpack from 'webpack';
import morgan from 'morgan';
import config from './../webpack.config.dev.js';

import dataRouter from './data/index';
import fileRouter from './file/index';
import extRouter from '../extensions/compute/api';
import importRouter from '../extensions/convert/import';
import exportRouter from '../extensions/convert/export';
import searchRouter from '../extensions/search/search';

const DEFAULT_PORT = 3000;
const port = parseInt(process.argv[2], 10) || process.env.PORT || DEFAULT_PORT;
const hostname = '0.0.0.0';

const app = express();
const compiler = webpack(config);

//logging middleware
app.use(morgan('dev'));

// Register Hotloading Middleware
// ----------------------------------------------------

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler));


// Register API middleware
// ----------------------------------------------------

// Old Auth Routes - leaving this here to be used in open-source local dev mode?
//import { authRouter } from './utils/authentication';
//app.use('/auth', authRouter);

// New Auth Implementation
import { insertAuth } from 'bio-user-platform';
// the auth routes are currently called from the client and expect JSON responses
// disable all redirects
var authConfig = {
  logoutLanding: false,
  loginLanding: false,
  loginFailure: false,
  apiEndPoint: process.env.API_END_POINT || "http://localhost:8080/api",
};
insertAuth(app, authConfig);

// all these should require authentication middleware

app.use('/data', dataRouter);
app.use('/file', fileRouter);

app.use('/compute', extRouter);
app.use('/import', importRouter);
app.use('/export', exportRouter);
app.use('/search', searchRouter);

// Register Client Requests, delegate routing to client
// ----------------------------------------------------

//Static Files
app.use('/images', express.static(path.join(__dirname, '../src/images')));

//so that any routing is delegated to the client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.listen(port, hostname, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Building, will serve at http://' + hostname + ':' + port);
});

export default app;
