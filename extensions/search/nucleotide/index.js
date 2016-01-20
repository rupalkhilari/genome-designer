const exec = require('child_process').exec;
const fs = require('fs');

module.exports = exports = {};

exports.search = function search(searchString, maxResults = 10) {
  const promise = new Promise((resolve, reject) => {
    const outfile = 'output.json';
    function readOutput() {
      fs.readFile(outfile, 'utf8', (err, data) => {
        if (err) {
          reject(err.message);
          return;
        }
        resolve(data);
      });
    }

    exec('python3 extensions/search/nucleotide/search.py "' + searchString + '" ' + maxResults + ' ' + outfile, (err, stdout) => {
      if (err) {
        reject(err.message);
        return;
      }
      readOutput();
    });
  });

  return promise;
};

exports.exportProject = function exportProject(proj, blocks) {
};

exports.importProject = function importProject(gbstr) {
};
