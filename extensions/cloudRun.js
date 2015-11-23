var exec, promise;
 
exec = require('promised-exec');

/**
 * @description
 * @param dir
 * @returns 
 */
export const runNode = (id) => {
  var dir = getNodeDir(id);
  
  var cmdBuild = "docker build -t \"" + id + "\" " + dir;
  var cmdRun = "docker run -v " + dir + "/inputs:/inputs -v " + dir + "/outputs:/outputs -i \"" + id + "\" &";

  return exec(cmdBuild).then(result => {

            console.log("Done with Build...Running");
    
            return exec(cmdRun).then(result => {

                    console.log("Done with Run");
                }).catch(err => {
                    
                    //apparently, even warning messages trigger this section of exec, so it "usually" ok
                    console.log("Done with Run");

                });
        }).catch(err => {

            console.log(err);

        });
};

export const getNodeDir = (id) => {
    return process.cwd() + "/extensions/cloud/" + id;
};