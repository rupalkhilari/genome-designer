## Setup Overview

Two webpack configurations, both in webpack.config.js. One for server, one for client.

The client is always bundled using webpack + babel and sent from the server, using webpack-dev-middleware and webpack-hot-middleware, so it is made quickly and served from memory.
 
Server is written so you can:
 - run in development directly in babel-node (e.g. for testing)
 - serve using Browser Sync, to include hotloading middleware etc. (dev)
 - or build and run using node (production or dev - **forthcoming**)
 
Server launches in its own process, and new process is started every time the server rebuilds, and is proxied using BrowserSync. The proxy also dynamically adds in hot module loading, and reload when static assets update, and React Hot Module loading and React Transform.

TODO: Build the server. Not building because of relative path issues, in particular of non-static imports (e.g. all the plugins)

## Build Automation Tools

#### `npm run start` (`start.js`)

* Cleans up the output `/build` directory (`clean.js`)
* Copies static files to the output folder (`copy.js`)
* Launches [Webpack](https://webpack.github.io/) compiler in a watch mode, and runs the server in a Browser Sync Proxy

#### `npm run build` (`build.js`)

* Cleans up the output `/build` folder (`clean.js`)
* Copies static files to the output folder (`copy.js`)
* Creates application bundles with Webpack (`bundle.js`, `webpack.config.js`)

#### Options

Flag          | Description
------------- | -------------------------------------------------- 
`--release`   | Minimizes and optimizes the compiled output
`--verbose`   | Prints detailed information to the console
`--debugmode` | Launches the App in Debugging mode (e.g. with Redux devtools)

For example:

```sh
$ npm run start     # Run the app for local development, with full sourcemapping etc.
```

```sh
$ npm start -- --release        # Launch dev server in production mode + minified
```

```sh
$ npm run build -- --release --verbose   # Build the app in production mode
```

The additional `--` before flags is necessary to pass the arguments from babel-node to the actual process spawned.

#### `npm run start-auth-stack` (`auth-stack.js`)

**Requires local install of `bio-user-platform`**

* Starts Docker
* Starts bio-user-platform
    * Authentication
    * Storage
* start server with authentication (`npm run auth`)

###### Options

Flag                                           | Description
---------------------------------------------- | --------------------------------------------------
`--PLATFORM_PATH=/path/to/bio-user-platform/`  | Define path to bio-user-platform, defaults to sibling with project root
`--DEBUG`                                      | Log all output

##### Example

```sh
$ babel-node tools/run auth-stack -- --DEBUG # Run using babel-node directly, and pass in a flag
```

#### Misc

* `webpack.config.js` - Webpack configuration for both client-side and server-side bundles
* `run.js` - Helps to launch other scripts with `babel-node` (e.g. `babel-node tools/run build`)
* `.eslintrc` - ESLint overrides for built automation scripts