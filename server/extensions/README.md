# Extensions

## Overview

Genome designer is built to accommodate extensions, which extend the front-end web application.

## Registering extensions

Include extensions in `/server/extensions/package.json`, and they will be installed using NPM. You can include local paths for extensions included locally, or npm modules. 

## Extension Format

Extensions are expected to be npm modules, already built, and provide an entrypoint of `index.js`

Extensions should export a `manifest` about the extension (defined below), which includes a `render()` function and defines a region for

### manifest <object>

```
{
  name : "extension name",
  version : "extension version",
  render : <render() defined below>
  region: <extension region, defined below>
}
```

#### `render(container)` <function>

This function is called when the extension is to be loaded. It may be called more than once in a user's session, e.g. if they navigate away from the design page.

#### region <string>

Area of the application where the extension will render.

Regions include:

- sequenceDetail
