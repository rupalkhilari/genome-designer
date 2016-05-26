import loadScript from 'load-script';

const cached = {};

/**
 * given an extension, actually load the script
 *
 * resolve(false) - was cached
 * resolve(true) - was downloaded
 * reject(err) - error downloading
 */
export const downloadExtension = (name) => {
  return new Promise((resolve, reject) => {
    if (cached[name]) {
      resolve(false);
    }

    //we need index.js so that relative sourcemap paths will work properly
    const url = `/extensions/load/${name}/index.js`;
    loadScript(url, (err, script) => {
      if (err) {
        reject(err);
      }
      cached[name] = true;
      resolve(true);
    });
  });
};

export default downloadExtension;
