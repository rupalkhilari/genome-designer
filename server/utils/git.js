import nodegit from 'nodegit';
import path from 'path';

const makePath = (path) => {
  return path.resolve(__dirname, path, './.git');
};

export const initialize = (path) => {
  return nodegit.Repository.init(makePath(path), 0)
    .then(repo => path)
    .catch(Promise.reject);
};

//todo = verify
export const isInitialized = (path) => {
  return nodegit.Repository.open(makePath(path))
    .then(repo => {
      return true;
    })
    .catch(() => {
      console.log('caught!');
      return false;
    });
};

//todo - prevent conflicts
//see https://github.com/nodegit/nodegit/blob/master/examples/add-and-commit.js
export const commit = (path) => {
  return nodegit.Repository.open(makePath(path))
    .then(repo => {

    })
    .catch((err) => {

    });
};

export const log = (path) => {

};

//todo - open file at specific commit
