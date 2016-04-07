## Build + Runs

The client is always bundled using webpack + babel and sent from the server. 
 
Server is written so you can:
 - run in development directly in babel-node (WIP)
 - serve using Browser Sync, to include hotloading middleware etc. (dev)
 - or build and run using node (production or dev)

## Build Automation Tools

##### `npm run start` (`start.js`)

* Cleans up the output `/build` directory (`clean.js`)
* Copies static files to the output folder (`copy.js`)
* Launches [Webpack](https://webpack.github.io/) compiler in a watch mode 
* Launches Node.js server from the compiled output folder, in its own process (`runServer.js`)
* Includes BrowserSync as a proxy to dynamically add in hot module loading, and reload when static assets update
* Includes [HMR](https://webpack.github.io/docs/hot-module-replacement), and
  [React Transform](https://github.com/gaearon/babel-plugin-react-transform)

##### `npm run build` (`build.js`)

* Cleans up the output `/build` folder (`clean.js`)
* Copies static files to the output folder (`copy.js`)
* Creates application bundles with Webpack (`bundle.js`, `bundleServer.js`, `webpack.config.js`)

##### `npm run deploy` (`deploy.js`)

**todo**

##### Options

Flag        | Description
----------- | -------------------------------------------------- 
`--release` | Minimizes and optimizes the compiled output
`--verbose` | Prints detailed information to the console

For example:

```sh
$ npm run build -- --release --verbose   # Build the app in production mode
```

or

```sh
$ npm start -- --release                 # Launch dev server in production mode
```

#### Misc

* `webpack.config.js` - Webpack configuration for both client-side and server-side bundles
* `run.js` - Helps to launch other scripts with `babel-node` (e.g. `babel-node tools/run build`)
* `.eslintrc` - ESLint overrides for built automation scripts