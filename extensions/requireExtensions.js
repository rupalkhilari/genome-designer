const fs = require('fs');
const exports = module.exports;

const _extensions = {};
const _extensionsInfo = { GUI: {} };
const _errors = {};

function loadExtensions() {
  return new Promise( (resolve, reject) => {
    fs.readFile('extensions/registeredExtensions.json', 'utf8', (err, file) => {
      if (err) {
        reject('Failed to open registeredExtensions.json file');
        return;
      }

      let name, extensions, path, namespace, namespaces;

      try {
        namespaces = JSON.parse(file);
      } catch (exception) {
        reject('Failed to load extensions file: ' + exception.message);
        return;
      }

      for (namespace in namespaces) {
        extensions = namespaces[namespace];
        _extensions[namespace] = _extensions[namespace] || {};
        _extensionsInfo[namespace] = _extensionsInfo[namespace] || {};
        _errors[namespace] = _errors[namespace] || {};
        for (name in extensions) {
          if (_extensions[namespace][name] === undefined) { //don't reload
            try {
              path = extensions[name].path;
              if (!extensions[name].gui) {
                _extensions[namespace][name] = require(path);
              } else {
                _extensionsInfo.GUI[namespace] = _extensionsInfo.GUI[namespace] || {};
                _extensionsInfo.GUI[namespace][name] = require(path + '/package.json');
                _extensionsInfo.GUI[namespace][name].path = path;
              }
              _extensionsInfo[namespace][name] = require(path + '/package.json');
            } catch (exception) {
              _extensionsInfo[namespace][name] = 'Failed to load ' + name + ' : ' + exception.message;
            }
          }
        }
      }
      resolve(_extensions);
    });
  });
}

exports.getExtension = (namespace, name) => {
  return new Promise( (resolve, reject) => {
    if (!namespace || !name) {
      reject("Invalid input");
      return;
    }

    if (_extensions[namespace] && _extensions[namespace][name]) {
      resolve(_extensions[namespace][name]);
      return;
    }

    loadExtensions()
    .then(extensions => {
      if (extensions[namespace] && extensions[namespace][name]) {
        resolve(extensions[namespace][name]);
        return;
      }
      reject('No such extension: ' + namespace + '.' + name);
    });
  });
};

exports.getExtensionsInfo = () => {
  return new Promise( (resolve, reject) => {
    loadExtensions()
    .then(extensions => {
      resolve(_extensionsInfo);
    });
  });
};
