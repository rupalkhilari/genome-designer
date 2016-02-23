import * as filePaths from '../../../server/utils/filePaths';
import * as fileSystem from '../../../server/utils/fileSystem';
import path from 'path';
const exec = require('child_process').exec;
const uuid = require('node-uuid');

const dbName = 'nucleotide';
const createRandomStorageFile = () => filePaths.createStorageUrl('temp-' + uuid.v4());

export const search = (searchString, maxResults = 10) => {
  const outputFile = createRandomStorageFile();
  const command = `python ${path.resolve(__dirname, 'search.py')} ${dbName} "${searchString}" ${maxResults} ${outputFile}`;

  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  })
    .then(() => fileSystem.fileRead(outputFile));
  //todo - delete file?
};

export default search;
