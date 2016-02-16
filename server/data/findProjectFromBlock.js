import * as filePaths from './../utils/filePaths';
import { exec } from 'child_process';

export const findProjectFromBlock = (blockId) => {
  if (!blockId) {
    return Promise.reject(null);
  }

  return new Promise((resolve, reject) => {
    const storagePath = filePaths.createStorageUrl();
    exec(`cd ${storagePath} && find . -type d -name ${blockId}`, (err, output) => {
      const lines = output.split('/n');
      if (lines.length === 1) {
        const [ /* idBlock */, idProject ] = lines[0].split('/').reverse();
        resolve(idProject);
      } else {
        reject(null);
      }
    });
  });
};

export default findProjectFromBlock;
