const exec = require('child_process').exec;
const fs = require('fs');

module.exports = exports = {};

exports.exportBlock = function exportBlock(block, blocks) {
  const input = {
    block: block,
    blocks: blocks,
  };

  const promise = new Promise((resolve, reject) => {
    function readOutput() {
      fs.readFile('output.gb', 'utf8', (err, data) => {
        if (err) {
          reject(err.message);
          return;
        }
        resolve(data);
      });
    }

    function runPy() {
      exec('python3 extensions/convert/genbank/convert.py to_genbank data.json output.gb', (err, stdout) => {
        if (err) {
          reject(err.message);
          return;
        }
        readOutput();
      });
    }

    fs.writeFile('data.json', JSON.stringify(input), 'utf8', (err, data) => {
      if (err) {
        reject(err.message);
        return;
      }
      runPy();
    });
  });

  return promise;
};

exports.importBlock = function importBlock(gbstr) {
  const promise = new Promise((resolve, reject) => {
    function readOutput() {
      fs.readFile('output.json', 'utf8', (err, data) => {
        if (err) {
          reject(err.message);
          return;
        }
        resolve(data);
      });
    }

    function runPy() {
      exec('python3 extensions/convert/genbank/convert.py from_genbank input.gb output.json', (err, stdout) => {
        if (err) {
          reject(err.message);
          return;
        }
        readOutput();
      });
    }

    fs.writeFile('input.gb', gbstr, 'utf8', (err, data) => {
      if (err) {
        reject(err.message);
        return;
      }
      runPy();
    });
  });

  return promise;
};

exports.exportProject = function exportProject(proj, blocks) {
  var spawn = require('child_process').spawn;

  const promiseArray = [];
  let i;
  for (i in blocks) {
    promiseArray.push(exports.exportBlock(blocks[i], blocks));
  }


  Promise.all(promiseArray)


    // Options -r recursive -j ignore directory info - redirect to stdout
    var zip = spawn('zip', ['-rj', '-', SCRIPTS_PATH]);

    res.contentType('zip');

    // Keep writing stdout to res
    zip.stdout.on('data', function (data) {
      res.write(data);
    });

    zip.stderr.on('data', function (data) {
      // Uncomment to see the files being added
      //console.log('zip stderr: ' + data);
    });

    // End the response on zip exit
    zip.on('exit', function (code) {
      if(code !== 0) {
        res.statusCode = 500;
        console.log('zip process exited with code ' + code);
        res.end();
      } else {
        res.end();
      }
    });
  });
};

exports.importProject = function importProject(gbstr) {
};
