# Extensions

## Overview

Genetic Constructor is built to accommodate extensions which run on the client and augment the web application.

Extensions are installed via `npm` into `node_modules` in this directory.

Extensions can be hosted within this project, on Github, or on NPM.

## Registering extensions

Include extensions in `/server/extensions/package.json`, and they will be installed using NPM. You can include local paths for extensions included locally, github repositories, or npm modules, or in any other manner supported by NPM.

It is expected that extensions are already installed and built (e.g. using `npm run install-extensions`) by the time the server has started. They are installed into `node_modules` in this folder.

At this time, the client is bootstrapped with knowledge of all the plugins available on the server, but they are initialized lazily as needed (i.e. `package.json` manifest available, `index.js` loaded when needed).

## Extension Format

Extensions are expected to be NPM modules. They must provide:
 
- an entrypoint of `index.js` which is responsible for calling `window.constructor.extensions.register(extensionKey, render)`. The format of the render function is given below. The Genetic Constructor server will only serve `index.js` - you must host other files externally if they are to be loaded lazily.
- package.json with fields `name`, `version`, `region` (defined below), and optionally `readable`, `description`, etc.

### Examples

Examples are given in the directory `/extensions/` of this project.

#### package.json

```
{
  "name": "sequenceViewer",
  "readable": "Sequence Viewer",
  "version" : "1.0.0",
  "description": "Detailed Sequence viewer for Constructor",
  "region" : "sequenceDetail"
}
```

#### region <string>

Area of the application where the extension will render.

Possible regions are in `src/extensions/regions.js`

### `render(container, options)` <function>

This function is called when the extension is to be loaded. It is passed the container into which the extension is to render.
 
It may be called more than once in a user's session, e.g. if they navigate away from the design page.
