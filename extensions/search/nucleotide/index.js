const exec = require('child_process').exec;
const fs = require('fs');

module.exports = exports = {};
const dbName = 'nucleotide';

exports.search = function search(searchString, maxResults = 10) {
  const promise = new Promise((resolve, reject) => {
    const outfile = 'temp.json';
    function readOutput() {
      fs.readFile(outfile, 'utf8', (err, data) => {
        if (err) {
          reject(err.message);
          return;
        }
        resolve(JSON.parse(data));
      });
    }

    exec('python extensions/search/nucleotide/search.py ' + dbName + ' "' + searchString + '" ' + maxResults + ' ' + outfile, (err, stdout) => {
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
