Extensions are client-side additions for Genetic Constructor, which allow for interaction with user's data from the client, and widgets inserted at specified regions within the app.

This directory is for local extensions only. By default, they will not automatically be installed. Extensions that are accessible to the server should be listed in `/server/extensions/package.json` and will be installed using npm. Extensions in this folder will only be accessible if listed in that manifest.

### Tips

##### `npm link`

Using NPM's package linking will speed your development process. NPM has support for setting up symlinks. You can use `npm link` to link an extension you are actively developing to the `node_modules` directory of the server, so that your changes automatically update the server without requiring reinstallation of all extensions.

Suppose you wish to develop an extension `myExtension`.

If you do not have an extension, let's create one in `/extensions/myExtension`:

```sh
$ cd extensions
$ mkdir myExtension
$ cd myExtension

# set up your extension's NPM package
$ npm init
# follow the steps...
```

Now, let's set up the link. Note that you should not add the extension to `server/extensions/package.json`.

```sh
# this will expose your extension globally on your file system, the first part of setting up the symlink
# it will be exposed using the name listed in package.json
$ npm link

# go back to project root
$ cd ../..

# go into server/extensions
$ cd server/extensions

# add the link, assuming your package name is myExtension
$ npm link myExtension

# start / restart the server (to ensure your extension is picked up in the registry)
$ npm run start
```

Now, you should see a linked directory `myExtension` in `node_modules` of server/extensions. Simply reload the client and you should be served the latest version of your code, as the server dynamically pulls from the directory of your extension.

Note that `npm run install-extensions` clears the `node_modules` directory, so you will have to re-establish the link after running that script using `npm link <packageName>`.
