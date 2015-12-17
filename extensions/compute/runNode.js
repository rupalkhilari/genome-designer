const exec = require('promised-exec');

export const getNodeDir = (id) => {
    return process.cwd() + '/extensions/compute/' + id;
};

let nodesStartedBuilding = {};
let nodesDoneBuilding = {};

export const buildNodeContainer = (id) => {

  if (nodesStartedBuilding[id]) return nodesStartedBuilding[id];

  let dir = getNodeDir(id);

  if (nodesDoneBuilding[id]) {
    console.log('Container for ' + id + ' already exists');
    return Promise.resolve(true);
  }

  let cmdBuild = 'docker build -t \'' + id + '\' ' + dir;  
  console.log('Start building ' + id + '...');
  nodesStartedBuilding[id] = exec(cmdBuild).then(result => {
      nodesDoneBuilding[id] = true;
      return Promise.resolve(result);
    }).catch(err => {
      console.log(id + ' build failed: ' + err.string);
      return Promise.reject(err);
    });

  return nodesStartedBuilding[id];
};

/**
 * @description
 * @param dir
 * @returns
 */
export const runNode = (id) => {
  let dir = getNodeDir(id);

  let cmdRun = 'docker run -v ' + dir + '/inputs:/inputs -v ' + dir + '/outputs:/outputs -i \'' + id + '\' &';
  console.log(cmdRun);

  return buildNodeContainer(id).then(result => {

            return exec(cmdRun).then(result => {
                    return Promise.resolve(true);
                }).catch(err => {
                    //apparently, even warning messages trigger this section of exec, so it 'usually' ok
                    return Promise.resolve(true);
                });
        }).catch(err => {
            console.log(err);
            return Promise.reject(err);
        });
};



export const copyNodeInputFiles = () => {
  
}
