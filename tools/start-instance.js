import webpack from 'webpack';
import run from './run';
import runServer from './runServer';
import { clientConfig } from './webpack.config';
import clean from './clean';
import copy from './copy';

//This is a short term file which is used to build the client, and run the server once. Meant for short-term production use, getting rid of webpack middleware etc., but still running the server in babel-node.

async function start() {
  await run(clean);
  await run(copy.bind(undefined, { watch: true }));
  await new Promise(resolve => {
    const clientCompiler = webpack(clientConfig);

    //explicitly compile since we arent using any middleware
    clientCompiler.run(err => {
      console.log('starting server');
      runServer(() => resolve);
    });
  });
}

export default start;
