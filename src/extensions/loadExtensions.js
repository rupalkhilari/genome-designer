import registry, { validRegion } from './clientRegistry';
import downloadExtension from './downloadExtension';
import { getExtensionsInfo } from '../middleware/extensions';

//for now, build the registry using everything registered on the server, and load automatically
function loadAllExtensions() {
  getExtensionsInfo()
    .then(manifests => {
      return Promise.all(Object.keys(manifests).map(key => {
        return downloadExtension(key)
          .catch(err => {
            console.warn('couldnt load extension ' + key);
            console.error(err);
          });
      }));
    })
    .then(() => registry);
}

//load everything automatically after a moment...
setTimeout(loadAllExtensions, 100);
