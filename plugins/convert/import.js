import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import { getPlugin } from '../loadPlugin';
import * as persistence from '../../server/data/persistence';
import * as rollup from '../../server/data/rollup';

const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

const namespace = 'convert';

function callImportFunction(funcName, id, data) {
  return getPlugin(namespace, id)
    .then(mod => {
      return new Promise((resolve, reject) => {
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

function importConstruct(id, data) {
  return callImportFunction('importConstruct', id, data);
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

  //assuming contents to be string
  let buffer = '';

  //get data in parts
  req.on('data', data => {
    buffer += data;
  });

  //received all the data
  req.on('end', () => {
    const promise = importProject(id, buffer)
      .then((roll) => {
        rollup.writeProjectRollup(roll.project.id, roll, req.user.uuid)
          .then(() => persistence.projectSave(roll.project.id))
          .then(commit => resp.status(200).json({ProjectId: roll.project.id}))
          .catch(err => {
            console.log(err);
            resp.status(400).send(err);
          });
      })
      .catch(err => {
        resp.status(500).send(err);
      });
  });
});

router.post('/construct/:id', jsonParser, (req, resp) => {
  const { id } = req.params;

  //assuming contents to be string
  let buffer = '';

  //get data in parts
  req.on('data', data => {
    buffer += data;
  });

  //received all the data
  req.on('end', () => {
    const promise = importConstruct(id, buffer)
      .then((roll) => {
        if (! _.isString(roll)) {
          resp.status(200).json({roots: roll.roots, blocks: roll.blocks});
        }
        else {
          resp.status(500).send(roll);
        }
      })
      .catch(err => {
        resp.status(500).send(err);
      });
  });
});

//export these functions for testing purpose
router.importProject = importProject;
router.importConstruct = importConstruct;

module.exports = router;
