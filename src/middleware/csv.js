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
const contentTypeTextHeader = { headers: { 'Content-Type': 'text/plain' } };

export const convert = (csvString, projectId) => {
  invariant(false, 'forthcoming');
  invariant(typeof csvString === 'string', 'must pass a csv file as text. to use a file, use importCsvFile.');

  const url = extensionApiPath(extensionKey, `import/convert`);

  return rejectingFetch(url, headersPost(csvString, contentTypeTextHeader))
    .then(resp => resp.json());
};

/**
 * @private
 * import a CSV file into the given project or into a new project.
 * project ID is returned and should be reloaded if the current project or opened if a new project.
 * Promise resolves with projectId on success and rejects with fetch response
 */
export const importString = (csvString, projectId) => {
  invariant(typeof csvString === 'string', 'must pass a csv file as text. to use a file, use importCsvFile.');

  const url = extensionApiPath(extensionKey, `import${projectId ? ('/' + projectId) : ''}`);

  return rejectingFetch(url, headersPost(csvString, contentTypeTextHeader))
    .then(resp => resp.json())
    .then(json => {
      invariant(json && json.projectId, 'expect a project ID');
      return json.projectId;
    });
};

export const importFile = (csvFile, projectId) => {
  return readFileText(csvFile)
    .then(({ contents }) => importString(contents, projectId, options));
};
