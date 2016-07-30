/*
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import registry from './clientRegistry';
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
