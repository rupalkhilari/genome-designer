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

const extensionKey = 'genbank';
const contentTypeTextHeader = { headers: { 'Content-Type': 'text/plain' } };

/**
 * @private
 * import a CSV file into the given project or into a new project.
 * project ID is returned and should be reloaded if the current project or opened if a new project.
 * Promise resolves with projectId on success and rejects with fetch response
 */
export const importString = (genbankString, projectId) => {
  invariant(typeof genbankString === 'string', 'must pass a genbank file as text. to use a file, use importGenbankFile.');

  const url = extensionApiPath(extensionKey, `import${projectId ? ('/' + projectId) : ''}`);
  return rejectingFetch(url, headersPost(genbankString, contentTypeTextHeader))
    .then(resp => resp.json())
    .then(json => {
      invariant(json && json.ProjectId, 'expect a project ID');
      return json.ProjectId;
    });
};

export const importFile = (genbankFile, projectId) => {
  return readFileText(genbankFile)
    .then(contents => importString(contents, projectId));
};

//convert without creating a project, but will save sequences
export const convert = (genbankString, constructsOnly = false) => {
  invariant(typeof genbankString === 'string', 'must pass a genbank file as text. to use a file, use importGenbankFile.');

  const url = extensionApiPath('genbank', `import/convert${constructsOnly ? '?constructsOnly=true' : ''}`);
  return rejectingFetch(url, headersPost(genbankString, contentTypeTextHeader))
    .then(resp => resp.json());
};

export const exportBlock = (projectId, constructId) => {
  const url = extensionApiPath(extensionKey, `export/${projectId}${constructId ? ('/' + constructId) : ''}`);
  return rejectingFetch(url, headersGet())
    .then(resp => resp.text());
};

export const exportProject = (projectId) => {
  const url = extensionApiPath(extensionKey, `export/${projectId}`);
  return rejectingFetch(url, headersGet())
    .then(resp => resp.text());
};
