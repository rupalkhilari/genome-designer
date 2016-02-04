var fs = require('fs');

var extensionsFile = [];
console.log('export const registry = {}\n');

fs.readFile('extensions/registeredExtensions.json', 'utf8', function print(err, file) {
  var name, extensions, path, namespace, namespaces;

  if (err) {
    return;
  }

  try {
    namespaces = JSON.parse(file);
  } catch (exception) {
    return;
  }

  for (namespace in namespaces) {
    extensions = namespaces[namespace];
    extensionsFile.push('registry.' + namespace + ' = {}');
    for (name in extensions) {
      if (extensions[name].gui) {
        path = extensions[name].path.replace('./', '');
        extensionsFile.push('registry.' + namespace + '.' + name + ' = require(\'../../extensions/' + path + '\');');
      }
    }
  }

  console.log(extensionsFile.join('\n'));
});
