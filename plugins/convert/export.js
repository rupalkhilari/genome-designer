import express from 'express';
import bodyParser from 'body-parser';
import { getPlugin } from '../loadPlugin';
const router = express.Router(); //eslint-disable-line new-cap
import * as rollup from '../../server/data/rollup';
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
          func(input)
//          func(input[field], input.blocks)
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

function exportProject(id, roll) {
  return callExportFunction('exportProject', 'project', id, roll);
}

function exportConstruct(id, roll, constructId) {
  return callExportFunction('exportConstruct', 'project', id, { roll: roll, constructId: constructId });
}

//this function is just trying to avoid redundant code
function exportThenCatch(promise, resp, roll) {
  promise
  .then(res => {
    const name = (roll.project.metadata.name ? roll.project.metadata.name : roll.project.id) + '.gb';
    resp.attachment(name);
    if (roll.project)
    resp.status(200).send(res);
  })
  .catch(err => {
    resp.status(500).send(err);
  });
}

router.get('/:id/:projectId/:constructId?', jsonParser, (req, resp) => {
  const { id, projectId, constructId } = req.params;
  //const input = req.body;
//  const promise = exportProject(id, input);
  rollup.getProjectRollup(projectId)
    .catch(err => {
      resp.status(500).send(err);
    })
    .then(roll => {
      if (constructId) {
        const promise = exportConstruct(id, roll, constructId);
        exportThenCatch( promise, resp, roll );
      } else {
        const promise = exportProject(id, roll);
        exportThenCatch( promise, resp, roll );
      }
    });
});

//export these functions for testing purpose
router.exportProject = exportProject;
router.exportConstruct = exportConstruct;

module.exports = router;
