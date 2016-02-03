import { errorDoesNotExist, errorFileSystem } from './../utils/errors';
import mkpath from 'mkpath';
import rimraf from 'rimraf';
import fs from 'fs';

const parser = JSON.parse;
const stringifier = JSON.stringify;

export const fileExists = (path) => {
  return new Promise((resolve, reject) => {
    fs.access(path, (err) => {
      if (err) {
        reject(errorDoesNotExist);
      } else {
        resolve(path);
      }
    });
  });
};

export const fileRead = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, result) => {
      if (err) {
        reject(err);
      }
      const parsed = parser(result);
      resolve(parsed);
    });
  });
};

export const fileWrite = (path, contents, stringify = true) => {
  return new Promise((resolve, reject) => {
    const fileContent = !!stringify ? stringifier(contents) : contents;
    fs.writeFile(path, fileContent, 'utf8', (err) => {
      if (err) {
        reject(err);
      }
      resolve(path);
    });
  });
};

export const fileDelete = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        reject(err);
      }
      resolve(path);
    });
  });
};

export const directoryMake = (path) => {
  return new Promise((resolve, reject) => {
    mkpath(path, (err) => {
      if (err) {
        reject(errorFileSystem);
      }
      resolve(path);
    });
  });
};

export const directoryDelete = (path) => {
  return new Promise((resolve, reject) => {
    rimraf(path, (err) => {
      if (err) {
        reject(err);
      }
      resolve(path);
    });
  });
};
