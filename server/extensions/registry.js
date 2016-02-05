const manifest = require('./package.json');
const { dependencies } = manifest;

const extensionsFolder = '../../extensions/';

export default Object.keys(dependencies).reduce((acc, dep) => {
  const depManifest = require(extensionsFolder + dep + '/package.json');
  return Object.assign(acc, {
    [dep]: depManifest,
  });
}, {});
