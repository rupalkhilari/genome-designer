import path from 'path';
import cp from 'child_process';
import webpackConfig from './webpack.config';

// Should match the text string used in `src/server.js/server.listen(...)`
const RUNNING_REGEXP = /Building, will serve at http:\/\/(.*?)\//;

let server;
const { output } = webpackConfig;
const serverPath = path.join(__dirname, '../server/devServer.js');

// Launch or restart the Node.js server
function runServer(cb) {
  function onStdOut(data) {
    const time = new Date().toTimeString();
    const match = data.toString('utf8').match(RUNNING_REGEXP);

    process.stdout.write(time.replace(/.*(\d{2}:\d{2}:\d{2}).*/, '[$1] '));
    process.stdout.write(data);

    if (match) {
      server.stdout.removeListener('data', onStdOut);
      server.stdout.on('data', x => process.stdout.write(x));
      if (cb) {
        cb(null, match[1]);
      }
    }
  }

  if (server) {
    server.kill('SIGTERM');
  }

  //todo - build the server, not serve with babel-node

  server = cp.spawn('babel-node', [serverPath], {
    env: Object.assign({ NODE_ENV: 'dev' }, process.env),
    silent: false,
  });

  server.stdout.on('data', onStdOut);
  server.stderr.on('data', x => process.stderr.write(x));
}

process.on('exit', () => {
  if (server) {
    server.kill('SIGTERM');
  }
});

export default runServer;
