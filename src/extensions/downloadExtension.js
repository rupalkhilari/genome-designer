import loadScript from 'load-script';
import merge from 'lodash.merge';

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

    const url = `/extensions/load/${name}`;
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
