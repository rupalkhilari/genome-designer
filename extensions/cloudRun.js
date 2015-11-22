var exec, promise;
 
exec = require('promised-exec');

/**
 * @description
 * @param dir
 * @returns 
 */
export const run = (id) => {
  var dir = "extensions/cloud/" + id;
  console.log("docker build -t \"" + id + "\" " + dir);
  return exec("docker build -t \"" + id + "\" " + dir)
        .then(function (result) {
            var stdout = result.stdout;
            var stderr = result.stderr;
            console.log('stdout: ', stdout);
            console.log('stderr: ', stderr);
            console.log("docker run -v $(pwd)/" + dir + "/inputs:/inputs -v $(pwd)/" + dir + "/outputs:/outputs -i \"" + id + "\" ");
            return exec("docker run -v $(pwd)/" + dir + "/inputs:/inputs -v $(pwd)/" + dir + "/outputs:/outputs -i \"" + id + "\" ")
                .then(
                    function(result) {
                        var stdout = result.stdout;
                        var stderr = result.stderr;
                        console.log('stdout: ', stdout);
                        console.log('stderr: ', stderr);
                    }
                ).
                catch(function(err) {
                    console.log(err);
                });
        }).
        catch(function(err) {
            console.log(err);
        });
};


//run("TranslateDNAExample");