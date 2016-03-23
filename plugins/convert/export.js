import express from 'express';
import bodyParser from 'body-parser';
import { getPlugin } from '../loadPlugin';
const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

const namespace = 'convert';

//just avoiding redundant code
function callExportFunction(funcName, field, id, input) {
  return new Promise((resolve, reject) => {
    getPlugin(namespace, id)
    .then(mod => {
      if (mod && mod[funcName]) {
        try {
          const func = mod[funcName];
          func(input[field], input.blocks)
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
        reject('No export option named ' + id + ' for ' + field);
      }
    });
  });
}

function exportProject(id, input) {
  return callExportFunction('exportProject', 'project', id, input);
}

//this function is just trying to avoid redundant code
function exportThenCatch(promise, resp) {
  promise
  .then(res => {
    if (res.mimeType && res.data) {
      resp.contentType(res.mimeType);
      resp.write(res.data);
    } else {
      resp.json(res);
    }
  })
  .catch(err => {
    resp.status(500).send(err);
  });
}

router.post('/project/:id', jsonParser, (req, resp) => {
  const { id } = req.params;
  const input = req.body;
  const promise = exportProject(id, input);
  exportThenCatch( promise, resp );
});

//export these functions for testing purpose
router.exportProject = exportProject;

module.exports = router;
