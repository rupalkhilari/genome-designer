const exec = require('promised-exec');

export const getNodeDir = (id) => {
    return process.cwd() + '/extensions/compute/' + id;
};

/**
 * @description Run the given command
 * @returns Promise
 */
export const runCmd = (id,cmd) => {
  let dir = getNodeDir(id);

  let cmd = 'cd ' + dir + "; " + cmd;

  return exec(cmd).then(result => {
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
export const runNode = (id, fileUrls) => {
    let outputFiles = {};

    const dir = getNodeDir(id) + '/';

    fs.readFile(dir + 'workflow.yaml', 'utf8', (err, filestr) => {

      if (err) {
        console.log('Workflow.yaml could not be read: ' + err);
      } else {
        let data = yaml.parse(filestr);
        let inputs = data.inputs;
        let outputs = data.outputs;
        let cmd = data.command;
        let outputFileNames = [];
        let i,j;

        //inputs - write files using promises
        let inputDirWrites = [];
        let inputFileWrites = [];

        //we need to provide a new session-key to all cloud-computes
        //todo: get host url some other way
        let headers = {'sessionkey':key, 'host': 'http://0.0.0.0:3000'};

        inputDirWrites = [
            new Promise((resolve, reject) => {
              mkpath(dir + 'inputs/', (err) => {
                if (err) {
                  reject(err.message);
                } else {
                  resolve(dir + 'inputs/');
                }
              })
            }),
            new Promise((resolve, reject) => {
              mkpath(dir + 'outputs/', (err) => {
                if (err) {
                  reject(err.message);
                } else {
                  resolve(dir + 'outputs/');
                }
              })
            })
          ];

        Promise.all(inputDirWrites).then(result => {
          inputFileWrites.push(
              new Promise((resolve, reject) => {
                fs.writeFile( dir + 'inputs/headers', JSON.stringify(headers) , 'utf8', err => {
                    if (err) {
                      console.log(err.message);
                      reject(err.message);
                    } else {
                      resolve(dir + 'inputs/headers');
                    }
                  }); //fs.writeFile
                }));

          inputs.forEach(inputItem => {
            let inputKey = inputItem.id;
            inputFileWrites.push(
              new Promise((resolve, reject) => {
                let inputFile = fileUrls[inputKey].replace("/api/file/", "storage/");
                console.log('Reading ' + inputFile);
                fs.readFile(inputFile, 'utf8', (err, contents) => {
                  if (err) {
                    console.log(err.message);
                    reject(err.message);
                  }
                  fs.writeFile( dir + 'inputs/' + inputKey, contents , 'utf8', err => {
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
          for (i=0; i < outputs.length; ++i) {
            outputFiles[ outputs[i].id ] = '';
            outputFileNames.push(dir + 'outputs/' + outputs[i].id);
          }

          Promise.all(inputFileWrites).then(result => {
            if (!result) {
              console.log('Input write error');
            }

            //run the node
            runNode(id,cmd).then( res => {

              //read the output files
              readMultipleFiles(outputFileNames, 'utf8', (err, buffers) => {

                if (err) {
                  console.log('Output read error: ' + err);
                }

                //get values from files into object
                //TODO - select only json-suitable output fields

                let outputFileWrites = [];
                for (let i=0; i < outputFileNames.length; ++i) {

                  let outFile = fileUrls[outputs[i].id];
                  let contents = buffers[i];

                  outputFileWrites.push(
                    new Promise((resolve, reject) => {

                      if (outFile) {
                        outputFiles[ outputs[i].id ] = outFile;
                        outFile = outFile.replace("/api/file/","storage/");

                          //create folder for outFile
                          let path = outFile.substring(0,outFile.lastIndexOf('/')+1);
                          mkpath(path, (err) => {

                            if (err) {
                              console.log(err.message);
                              return reject(err.message);
                            } else {

                              fs.writeFile(outFile, contents , 'utf8', err => {
                                if (err) {
                                  console.log(err.message);
                                  reject(err.message);
                                } else {
                                  console.log('Wrote ' + outFile);
                                  return resolve(outFile);
                                }
                              }); //fs.writeFile

                            }
                          }); //make path
                      } else { //if not writing to output file, return in json
                        outputFiles[ outputs[i].id ] = contents;
                        return resolve(contents);
                      }
                    }));
                }

                Promise.all(outputFileWrites)
                  .then(result => {
                    //return object
                    Promise.resolve(outputFiles);
                  })
                  .catch(err => {
                    Promise.reject(err.message);
                  });


              }); //readMultipleFiles
            }); //runNode
          })
          .catch(err => { console.log(err); }); //writeInputFiles
        })
        .catch(err => { console.log(err); }); //writeInputDirs
      }   //read yaml file successful
    }); //fs.readFile

};
