var resemble = require('../node_modules/node-resemble-js/resemble.js');
var fs = require('fs');
var path = require('path');
var clc = require('../node_modules/cli-color/index.js');

// get the cannonical and test folders for images
var truth = process.argv[process.argv.findIndex(arg => arg === '--truth') + 1];
var test = process.argv[process.argv.findIndex(arg => arg === '--hypothesis') + 1];

// get full path of all files in folder, ignoring sub folders
const filesInFolder = (folder) => {
  return fs.readdirSync(folder)
    .map(name => {
      return path.join(folder, name);
    })
    .filter(fullPath => {
      return !fs.statSync(fullPath).isDirectory();
    });
};
// just the files name
const fileFromPath = (fullPath) => {
  const dir = path.dirname(fullPath);
  return fullPath.substr(dir.length);
};

console.log('|====== Screenshot Comparison ======|');
console.log(`Cannonical Folder: ${truth}`);
console.log(`Tests Folder     : ${test}`);

filesInFolder(truth).forEach(file => {
  // get corresponding file in tests folder
  const match = path.join(test, fileFromPath(file));
  console.log(clc.yellow(`Comparing\n${file}\n${match}`));
  resemble(file).compareTo(match).onComplete(function(data){
    const misMatch = parseFloat(data.misMatchPercentage);
    if (data.isSameDimensions && misMatch === 0) {
      console.log(clc.green('Perfect Match'))
    } else {
      if (!data.isSameDimensions) {
        console.log(clc.red('Images are different sizes'));
      } else {
        if (misMatch < 1e-6) {
          console.log(clc.orange('Images are very similar ( < 1e-6% delta )'));
        } else {
          console.error(clc.red(`Error, mismatch: ${misMatch}%`));
        }
      }
    }
  });
});
