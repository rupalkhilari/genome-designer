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
        resolve(JSON.parse(data));
      });
    }

    function runPy() {
      exec('rm output.json; python3 extensions/convert/genbank/convert.py from_genbank input.gb output.json', (err, stdout) => {
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
};

exports.importProject = function importProject(gbstr) {
};
