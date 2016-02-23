import path from 'path';
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

import { authRouter } from './utils/authentication';

const DEFAULT_PORT = 3000;
const port = parseInt(process.argv[2], 10) || process.env.PORT || DEFAULT_PORT;
const hostname = '0.0.0.0';

var ROOT = path.dirname(__dirname);
const app = express();
const compiler = webpack(config);

//logging middleware
app.use(morgan('dev'));

//Hotloading Middleware
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}));
app.use(require('webpack-hot-middleware')(compiler));

//authentication
app.use('/auth', authRouter);

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

app.get('/version', function(req, res) {
	try {
		var version = require('fs').readFileSync(path.join(ROOT, 'VERSION'));
		res.send(version);
	} catch(ignored) {
		res.send('Missing VERSION file');
	}
});

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
