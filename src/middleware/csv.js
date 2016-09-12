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
import rejectingFetch from './rejectingFetch';
import invariant from 'invariant';
import { headersGet, headersPost, headersPut, headersDelete } from './headers';
import { extensionApiPath } from './paths';
import readFileText from './utils/fileReader';

const extensionKey = 'csv';

function importBase(payload, projectId) {
  invariant(typeof payload === 'object', 'payload must be object');
  invariant(typeof payload.string === 'string', 'must pass string to import');

  const url = extensionApiPath(extensionKey, `import${projectId ? ('/' + projectId) : ''}`);

  return rejectingFetch(url, headersPost(payload))
    .then(resp => resp.json());
}

export const convert = (csvString, options = {}) => {
  invariant(false, 'forthcoming');
  invariant(typeof csvString === 'string', 'must pass a csv file as text. to use a file, use importCsvFile.');

  const payload = Object.assign({}, options, { string: csvString });
  return importBase(payload, 'convert');
};

export const importString = (csvString, projectId, options = {}) => {
  invariant(typeof csvString === 'string', 'must pass a csv file as text. to use a file, use importFile.');

  const payload = Object.assign({}, options, { string: csvString });
  return importBase(payload, projectId)
    .then(json => {
      invariant(json && json.projectId, 'expect a project ID');
      return json.projectId;
    });
};

/**
 * @private
 * import a CSV file into the given project or into a new project.
 * project ID is returned and should be reloaded if the current project or opened if a new project.
 * Promise resolves with projectId on success and rejects with fetch response
 */
export const importFile = (csvFile, projectId, options = {}) => {
  return readFileText(csvFile)
    .then(({ name, string }) => {
      const payload = Object.assign({ name }, options, { string });
      return importBase(payload, projectId);
    })
    .then(json => {
      invariant(json && json.projectId, 'expect a project ID');
      return json.projectId;
    });
};
