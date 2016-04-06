import BrowserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import run from './run';
import runServer from './runServer';
import webpackConfig from './webpack.config';
import clean from './clean';
import copy from './copy';

const DEBUG = !process.argv.includes('--release');

async function start() {
  await run(clean);
  await run(copy.bind(undefined, { watch: true }));
  await new Promise(resolve => {
    // Patch the client-side bundle configurations
    // to enable Hot Module Replacement (HMR) and React Transform
    [webpackConfig].forEach(config => {
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

    const compiler = webpack(webpackConfig);

    let handleServerBundleComplete = () => {
      console.log('ahndling complete');

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
                  hot: true,
                  // IMPORTANT: dev middleware can't access config, so we should
                  // provide publicPath by ourselves
                  publicPath: webpackConfig.output.publicPath,

                  // pretty colored output
                  stats: webpackConfig.stats.colors,

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

    console.log('beginning webpack build');
    compiler.run((err) => {
      if (err) throw err;
    });
  });
}

export default start;
