# Extensions

Todo 

- script to install extensions
- actually install them in correct location via npm


## Overview

Genome designer is built to accommodate extensions, which extend the front-end web application.

Extensions are installed via `npm` into `node_modules` in this directory.

## Registering extensions

Include extensions in `/server/extensions/package.json`, and they will be installed using NPM. You can include local paths for extensions included locally, or npm modules. 

It is assumed that extensions are already installed and built (e.g. using `npm install`) by the time the server has started. They are installed into `node_modules` in this folder.

At this time, the client is bootstrapped with knowledge of all the plugins available on the server, but they are initialized lazily as needed (i.e. `package.json` manifest available, `index.js` loaded when needed).

## Extension Format

Extensions are expected to be NPM modules. They must provide:
 
- an entrypoint of `index.js` which is responsible for calling `gd.registerExtension(manifest, render)`. The format of the render function is given below.
- package.json with fields `id`, `name`, `version`, `region` (defined below) 

### example 

An trivial example is given in extensions/simple

#### package.json

```
{
  "id": "onion",
  "name": "Sequence Viewer",
  "version" : "1.0.0",
  "description": "Detailed Sequence viewer from EGF",
  "region" : "sequenceDetail"
}
```

#### region <string>

Area of the application where the extension will render.

Possible regions are in `src/extensions/regions.js`

### `render(container)` <function>

This function is called when the extension is to be loaded. It is passed the container into which the extension is to render.
 
It may be called more than once in a user's session, e.g. if they navigate away from the design page.
