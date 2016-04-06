import BrowserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import run from './run';
import runServer from './runServer';
import { clientConfig } from './webpack.config';
import clean from './clean';
import copy from './copy';
import bundleServer from './bundleServer';

const DEBUG = !process.argv.includes('--release');

async function start() {
  await run(clean);
  await run(copy.bind(undefined, { watch: true }));
  await run(bundleServer);
  await new Promise(resolve => {
    // Patch the client-side bundle configurations
    // to enable Hot Module Replacement (HMR) and React Transform
    [clientConfig].forEach(config => {
      /* eslint-disable no-param-reassign */
      if (Array.isArray(config.entry)) {
        config.entry.unshift('webpack/hot/dev-server', 'webpack-hot-middleware/client');
      } else {
        config.entry = [
          'webpack/hot/dev-server',
          'webpack-hot-middleware/client',
          config.entry,
        ];
      }

      //caching + cache-busting
      //not yet in use. see e.g.: https://github.com/kriasoft/react-starter-kit/blob/master/tools/webpack.config.js
      //config.output.filename = config.output.filename.replace('[chunkhash]', '[hash]');
      //config.output.chunkFilename = config.output.chunkFilename.replace('[chunkhash]', '[hash]');

      config.plugins.push(new webpack.HotModuleReplacementPlugin());
      config.plugins.push(new webpack.NoErrorsPlugin());
      config
        .module
        .loaders
        .filter(x => x.loader === 'babel-loader')
        .forEach(x => (x.query = {
          ...x.query,

          // Wraps all React components into arbitrary transforms
          // https://github.com/gaearon/babel-plugin-react-transform
          plugins: [
            ...(x.query ? x.query.plugins : []),
            ['react-transform', {
              transforms: [
                {
                  transform: 'react-transform-hmr',
                  imports: ['react'],
                  locals: ['module'],
                }, {
                  transform: 'react-transform-catch-errors',
                  imports: ['react', 'redbox-react'],
                },
              ],
            },
            ],
          ],
        }));
      /* eslint-enable no-param-reassign */
    });

    const compiler = webpack(clientConfig);

    //need to essentially build twice so that browsersync starts with a valid bundle
    //use browsersync and its proxy so that we dont need to explicitly include it in server code, only when debugging...
    //also allows us to watch static assets
    let handleServerBundleComplete = () => {
      console.info('webpack initial build complete, starting browser-sync with webpack middleware');

      runServer((err, host) => {
        if (!err) {
          const bs = BrowserSync.create();

          bs.init({
            // no need to watch '*.js' here, webpack will take care of it for us,
            // including full page reloads if HMR won't work
            files: [
              'app/content/**/*.*',
              'app/styles/*.css',
            ],

            ...(DEBUG ? {} : { notify: false, ui: false }),

            proxy: {
              target: host,
              middleware: [
                webpackDevMiddleware(compiler, {
                  // IMPORTANT: dev middleware can't access config, so we should
                  // provide publicPath by ourselves
                  publicPath: clientConfig.output.publicPath,

                  // pretty colored output
                  stats: clientConfig.stats.colors,

                  // for other settings see
                  // http://webpack.github.io/docs/webpack-dev-middleware.html
                }),
                webpackHotMiddleware(compiler),
              ],
            },
          }, resolve);

          handleServerBundleComplete = runServer;
        }
      });
    };

    compiler.plugin('failed', (err) => console.warn(err));
    compiler.plugin('done', () => handleServerBundleComplete());

    console.info('beginning webpack build');
    compiler.run((err) => {
      if (err) throw err;
    });
  });
}

export default start;
