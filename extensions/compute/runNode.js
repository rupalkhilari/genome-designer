const fs = require('fs');
const exec = require('promised-exec');
const yaml = require('yamljs');
const mkpath = require('mkpath');
const readMultipleFiles = require('read-multiple-files');

export const getNodeDir = (id) => {
  return process.cwd() + '/extensions/compute/' + id;
};

/**
* @description Run the given command
* @returns Promise
*/
export const runCmd = (id, cmd) => {
  const dir = getNodeDir(id);

  const fullCmd = 'cd ' + dir + '; ' + cmd;

  return exec(fullCmd).then(result => {
    return Promise.resolve(true);
  }).catch(err => {
    console.log(err.message);
    //apparently, even warning messages trigger this section of exec, so it 'usually' ok
    return Promise.resolve(true);
  });
};

/**
* @description Copy the inputs from the given JSON, run the node command,
and return the output strings or file names
* @returns
*/
export const runNode = (id, fileUrls, header) => {
  const outputFiles = {};
  const dir = getNodeDir(id) + '/';

  fs.readFile(dir + 'workflow.yaml', 'utf8', (err, filestr) => {
    if (err) {
      console.log('Workflow.yaml could not be read: ' + err);
    } else {
      const data = yaml.parse(filestr);
      const inputs = data.inputs;
      const outputs = data.outputs;
      const cmd = data.command;
      const outputFileNames = [];
      let inputDirWrites = [];
      const inputFileWrites = [];
      let i;

      inputDirWrites = [
        new Promise((resolve, reject) => {
          mkpath(dir + 'inputs/', (err) => {
            if (err) {
              reject(err.message);
            } else {
              resolve(dir + 'inputs/');
            }
          });
        }),
        new Promise((resolve, reject) => {
          mkpath(dir + 'outputs/', (err) => {
            if (err) {
              reject(err.message);
            } else {
              resolve(dir + 'outputs/');
            }
          });
        }),
      ];

      Promise.all(inputDirWrites).then(result => {
        inputFileWrites.push(
          new Promise((resolve, reject) => {
            fs.writeFile( dir + 'inputs/headers', JSON.stringify(header), 'utf8', err => {
              if (err) {
                console.log(err.message);
                reject(err.message);
              } else {
                resolve(dir + 'inputs/headers');
              }
            }); //fs.writeFile
          }));

          inputs.forEach(inputItem => {
            const inputKey = inputItem.id;
            inputFileWrites.push(
              new Promise((resolve, reject) => {
                const inputFile = fileUrls[inputKey].replace('/api/file/', 'storage/');
                console.log('Reading ' + inputFile);
                fs.readFile(inputFile, 'utf8', (err, contents) => {
                  if (err) {
                    console.log(err.message);
                    reject(err.message);
                  }
                  fs.writeFile( dir + 'inputs/' + inputKey, contents, 'utf8', err => {
                    if (err) {
                      console.log(err.message);
                      reject(err.message);
                    } else {
                      console.log('Wrote ' + dir + 'inputs/' + inputKey);
                      resolve(dir + 'inputs/' + inputKey);
                    }
                  }); //fs.writeFile
                }); //fs.readFile
              }));
            });

            //outputs
            for (i = 0; i < outputs.length; ++i) {
              outputFiles[ outputs[i].id ] = '';
              outputFileNames.push(dir + 'outputs/' + outputs[i].id);
            }

            Promise.all(inputFileWrites).then(result => {
              if (!result) {
                console.log('Input write error');
              }

              console.log(cmd);

              //run the command
              return runCmd(id, cmd)
                .then(res => {
                  //read the output files

                  console.log(cmd);
                  readMultipleFiles(outputFileNames, 'utf8', (err, buffers) => {
                    if (err) {
                      console.log('Output read error: ' + err);
                    }
                    //get values from files into object
                    //TODO - select only json-suitable output fields
                    const outputFileWrites = [];

                    for (i = 0; i < outputFileNames.length; ++i) {
                      const outFile = fileUrls[outputs[i].id];
                      const contents = buffers[i];

                      outputFileWrites.push(
                        new Promise((resolve, reject) => {
                          if (outFile) {
                            outputFiles[ outputs[i].id ] = outFile;
                            const outFileTrue = outFile.replace('/api/file/', 'storage/');

                            //create folder for outFile
                            const path = outFileTrue.substring(0, outFileTrue.lastIndexOf('/') + 1);
                            mkpath(path, (err) => {
                              if (err) {
                                console.log(err.message);
                                return reject(err.message);
                              }

                              fs.writeFile(outFileTrue, contents, 'utf8', err => {
                                if (err) {
                                  console.log(err.message);
                                  reject(err.message);
                                } else {
                                  console.log('Wrote ' + outFileTrue);
                                  return resolve(outFileTrue);
                                }
                              }); //fs.writeFile
                            }); //make path
                          } else { //if not writing to output file, return in json
                            outputFiles[ outputs[i].id ] = contents;
                            return resolve(contents);
                          }
                        })
                      );
                    }

                    Promise.all(outputFileWrites)
                      .then(result => {
                        return Promise.resolve(outputFiles);
                      })
                      .catch(err => {
                        return Promise.reject(err.message);
                      });
                  }); //readMultipleFiles
                }); //runNode
            })
            .catch(err => { console.log(err); return Promise.reject(err.message); }); //writeInputFiles
          })
          .catch(err => { console.log(err); return Promise.reject(err.message); }); //writeInputDirs
        }   //read yaml file successful
      }); //fs.readFile
    };
