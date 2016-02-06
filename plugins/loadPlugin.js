const fs = require('fs');
const exports = module.exports;

const _plugins = {};
const _pluginInfo = { GUI: {} };
const _errors = {};

//todo - rename to plugins

function loadPlugins() {
  return new Promise( (resolve, reject) => {
    //fixme - this is going to be broken
    fs.readFile('extensions/registeredExtensions.json', 'utf8', (err, file) => {
      if (err) {
        reject('Failed to open registeredExtensions.json file');
        return;
      }

      let name, plugins, path, namespace, namespaces;

      try {
        namespaces = JSON.parse(file);
      } catch (exception) {
        reject('Failed to load extensions file: ' + exception.message);
        return;
      }

      for (namespace in namespaces) {
        plugins = namespaces[namespace];
        _plugins[namespace] = _plugins[namespace] || {};
        _pluginInfo[namespace] = _pluginInfo[namespace] || {};
        _errors[namespace] = _errors[namespace] || {};
        for (name in plugins) {
          if (_plugins[namespace][name] === undefined) { //don't reload
            try {
              path = plugins[name].path;
              if (!plugins[name].gui) {
                _plugins[namespace][name] = require(path);
              } else {
                _pluginInfo.GUI[namespace] = _pluginInfo.GUI[namespace] || {};
                _pluginInfo.GUI[namespace][name] = require(path + '/package.json');
                _pluginInfo.GUI[namespace][name].path = path;
              }
              _pluginInfo[namespace][name] = require(path + '/package.json');
            } catch (exception) {
              _pluginInfo[namespace][name] = 'Failed to load ' + name + ' : ' + exception.message;
            }
          }
        }
      }
      resolve(_plugins);
    });
  });
}

exports.getPlugin = (namespace, name) => {
  return new Promise( (resolve, reject) => {
    if (!namespace || !name) {
      reject("Invalid input");
      return;
    }

    if (_plugins[namespace] && _plugins[namespace][name]) {
      resolve(_plugins[namespace][name]);
      return;
    }

    loadPlugins()
    .then(extensions => {
      if (extensions[namespace] && extensions[namespace][name]) {
        resolve(extensions[namespace][name]);
        return;
      }
      reject('No such extension: ' + namespace + '.' + name);
    });
  });
};

exports.getPluginInfo = () => {
  return new Promise( (resolve, reject) => {
    loadPlugins()
    .then(extensions => {
      resolve(_pluginInfo);
    });
  });
};
