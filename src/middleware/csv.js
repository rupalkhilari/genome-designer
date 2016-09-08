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

export const importCsvString = (csvString, projectId) => {
  invariant(typeof csvString === 'string', 'must pass a genbank file as text. to use a file, use importGenbankOrCSV.');

  const url = extensionApiPath(extensionKey, `import${projectId ? ('/' + projectId) : ''}`);

  return rejectingFetch(url, headersPost(csvString, contentTypeTextHeader))
    .then(resp => resp.json());
};

export const importCsvFile = (csvFile, projectId) => {
  return readFileText(csvFile)
    .then(contents => importCsvString(contents, projectId));
};
