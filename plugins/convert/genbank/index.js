import * as filePaths from '../../../server/utils/filePaths';
import * as fileSystem from '../../../server/utils/fileSystem';
import path from 'path';
import Project from '../../../src/models/Project';
import Block from '../../../src/models/Block';

const exec = require('child_process').exec;
const uuid = require('node-uuid');

//todo - should validate blocks coming in / going out

const createRandomStorageFile = () => filePaths.createStorageUrl('temp-' + uuid.v4());

const runCommand = (command, input, inputFile, outputFile) => {
  return fileSystem.fileWrite(inputFile, input, false)
    .then(() => {
      return new Promise((resolve, reject) => {
        exec(command, (err, stdout) => {
          if (err) {
            reject(err);
          }
          else resolve(stdout);
        });
      });
    })
    .then(() => fileSystem.fileRead(outputFile, false));
};

export const exportProject = (project, blocks) => {
  const inputFile = createRandomStorageFile();
  const outputFile = createRandomStorageFile();
  const input = {
    project,
    blocks,
  };
  const cmd = `python ${path.resolve(__dirname, 'convert.py')} to_genbank ${inputFile} ${outputFile}`;

  return runCommand(cmd, JSON.stringify(input), inputFile, outputFile);
};

export const importProject = (genbankString) => {
  const inputFile = createRandomStorageFile();
  const outputFile = createRandomStorageFile();
  const cmd = `python ${path.resolve(__dirname, 'convert.py')} from_genbank ${inputFile} ${outputFile}`;

  return runCommand(cmd, genbankString, inputFile, outputFile)
    .then(resStr => {
      try {
        const res = JSON.parse(resStr);
        return Promise.resolve(res);
      } catch (err) {
        return Promise.reject(err);
      }
    });
};

//todo - this is a weird syntax of {block, blocks} and should be made consistent with `rollups` or at the very least better explained why exception is made

export const exportBlock = (block, blocks) => {
  const proj = new Project();
  blocks[block.id] = block;
  return exportProject(proj, blocks);
};

export const importBlock = (gbstr) => {
  return importProject(gbstr)
    .then(result => {
      if (result && result.project && result.blocks &&
        result.project.components && result.project.components.length > 0) {
        const bid = result.project.components[0];
        const block = result.blocks[bid];
        return Promise.resolve({block: block, blocks: result.blocks});
      }
      return Promise.reject('invalid input string');
    });
};
