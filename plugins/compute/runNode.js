import path from 'path';
import * as fileSystem from '../../server/utils/fileSystem';
const exec = require('child_process').exec;
const yaml = require('yamljs');

export const getNodeDir = (id) => {
  return path.resolve(__dirname, id);
};

/**
 * @description Run the given command
 * @returns Promise
 */
export const runCmd = (id, cmd) => {
  const dir = getNodeDir(id);
  const command = `cd ${dir}; ${cmd}`;

  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log(stdout);
        console.log(stderr);
        reject(err);
      }
      else resolve(stdout);
    });
  });
};

/**
 * @description Copy the inputs from the given JSON, run the node command, and return the output strings or file names
 * @param id {String} Node Id
 * @param inputFileUrls {Array<filePaths>}
 * @param header {Object} Optional
 * @returns {Promise.<T>}
 */
export const runNode = (id, inputFileUrls, header = {}) => {
  const dir = getNodeDir(id) + '/';

  const outputFiles = {};
  const outputFileNames = [];

  function readYaml(file) {
    return fileSystem.fileRead(file, false)
      .then(contents => yaml.parse(contents));
  }

  function createInputOutputFolders() {
    return Promise.all([
      fileSystem.directoryMake(dir + 'inputs/'),
      fileSystem.directoryMake(dir + 'outputs/'),
    ]);
  }

  function writeInputFiles(inputs) {
    return Promise.all([
      fileSystem.fileWrite(dir + 'inputs/headers', header),
      ...inputs.map(inputItem => {
        const inputKey = inputItem.id;
        //todo - when does this replace ever happen? is it ever relevant?
        const inputFile = inputFileUrls[inputKey].replace('/api/file/', 'storage/');

        return fileSystem.fileRead(inputFile, false)
          .then(contents => fileSystem.fileWrite(dir + 'inputs/' + inputKey, contents, false));
      }),
    ]);
  }

  function setupOutputFiles(outputs) {
    //outputs
    for (let i = 0; i < outputs.length; ++i) {
      Object.assign(outputFiles, {[outputs[i].id]: ''});
      outputFileNames.push(dir + 'outputs/' + outputs[i].id);
    }
  }

  function readOutputFiles(outputs) {
    return Promise.all(outputFileNames.map((fileName, index) => {
      return fileSystem.fileRead(fileName, false)
        .then(contents => {
          const outFile = dir + 'outputs/' + outputs[index].id;
          outputFiles[outputs[index].id] = contents;

          return fileSystem.directoryMake(outFile.substring(0, outFile.lastIndexOf('/') + 1))
            .then(() => fileSystem.fileWrite(outFile, contents, false));
        });
    }));
  }

  let inputs;
  let outputs;
  let command;

  return readYaml(dir + 'workflow.yaml')
    .then(data => {
      inputs = data.inputs;
      outputs = data.outputs;
      command = data.command;
    })
    .then(() => createInputOutputFolders())
    .then(() => setupOutputFiles(outputs))
    .then(() => writeInputFiles(inputs))
    .then(res => {
      if (!res) {
        return Promise.reject('Input write error');
      }

      return runCmd(id, command);
    })
    .then(res => {
      return readOutputFiles(outputs);
    })
    .then(res => {
      return Promise.resolve(outputFiles);
    });
};
