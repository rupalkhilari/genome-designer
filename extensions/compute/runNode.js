const exec = require('promised-exec');

export const getNodeDir = (id) => {
    return process.cwd() + '/extensions/compute/' + id;
};

/**
 * @description
 * @param dir
 * @returns
 */
export const runNode = (id,cmd) => {
  let dir = getNodeDir(id);

  let runCmd = 'cd ' + dir + "; " + cmd;
  console.log(runCmd);

  return exec(runCmd).then(result => {    
    return Promise.resolve(true);
  }).catch(err => {
    console.log(err.message);
    //apparently, even warning messages trigger this section of exec, so it 'usually' ok
    return Promise.resolve(true);
  });
};
