import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import { authenticationMiddleware } from '../../server/utils/authentication';
import { getExtension } from '../loadPlugin';
const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

const namespace = 'convert';

router.use(authenticationMiddleware);

function callImportFunction(funcName, id, data) {
  return new Promise((resolve, reject) => {
    getExtension(namespace, id)
    .then(mod => {
      if (mod && mod[funcName]) {
        try {
          const func = mod[funcName];
          func(data)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
        } catch (err) {
          reject(err);
        }
      } else {
        reject('No import option named ' + id + ' for projects');
      }
    });
  });
}

function importProject(id, data) {
  return callImportFunction('importProject', id, data);
}

function importBlock(id, data) {
  return callImportFunction('importBlock', id, data);
}

//this function is just trying to avoid redundant code
function importThenCatch(promise, resp) {
  promise
  .then(res => {
    resp.json(res);
  })
  .catch(err => {
    resp.status(500).send(err);
  });
}

router.post('/project/:id', jsonParser, (req, resp) => {
  const { id } = req.params;
  const data = req.body;

  if (data.file) {
    fs.readFile(data.file, 'utf8', (err, text) => {
      const promise = importProject(id, text);
      importThenCatch(promise, resp);
    });
  } else {
    const promise = importProject(id, data.text);
    importThenCatch(promise, resp);
  }
});

router.post('/block/:id', jsonParser, (req, resp) => {
  const { id } = req.params;
  const data = req.body;

  if (data.file) {
    fs.readFile(data.file, 'utf8', (err, text) => {
      const promise = importBlock(id, text);
      importThenCatch(promise, resp);
    });
  } else {
    const promise = importBlock(id, data.text);
    importThenCatch(promise, resp);
  }
});

//export these functions for testing purpose
router.importBlock = importBlock;
router.importProject = importProject;

module.exports = router;
