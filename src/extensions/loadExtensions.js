import rejectingFetch from '../middleware/rejectingFetch';
import registry, { validRegion } from './clientRegistry';
import downloadExtension from './downloadExtension';

//for now, build the registry using everything registered on the server, and load automatically
function loadAllExtensions() {
  const url = `/extensions/list`;
  rejectingFetch(url)
    .then(resp => resp.json())
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
