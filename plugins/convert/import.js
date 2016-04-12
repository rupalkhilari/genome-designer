import express from 'express';
import bodyParser from 'body-parser';
import { getPlugin } from '../loadPlugin';
import * as persistence from '../../server/data/persistence';
import * as rollup from '../../server/data/rollup';
import _ from 'lodash';

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

router.post('/project/:id/:projectId?', jsonParser, (req, resp) => {
  const { id, projectId } = req.params;

  //assuming contents to be string
  let buffer = '';

  //get data in parts
  req.on('data', data => {
    buffer += data;
  });

  //received all the data
  req.on('end', () => {
    return importProject(id, buffer)
      .then((roll) => {
        if (!projectId) {
          rollup.writeProjectRollup(roll.project.id, roll, req.user.uuid)
            .then(() => persistence.projectSave(roll.project.id))
            .then(commit => resp.status(200).json({ProjectId: roll.project.id}))
            .catch(err => {
              resp.status(400).send(err);
            });
        } else {
          rollup.getProjectRollup(projectId)
            .then((existingRoll) => {
              existingRoll.project.components = existingRoll.project.components.concat(roll.project.components);
              existingRoll.blocks = existingRoll.blocks.concat(roll.blocks);
              rollup.writeProjectRollup(existingRoll.project.id, existingRoll, req.user.uuid)
                .then(() => persistence.projectSave(existingRoll.project.id))
                .then(commit => resp.status(200).json({ProjectId: existingRoll.project.id}))
                .catch(err => {
                  resp.status(400).send(err);
                });
            })
            .catch(err => {
              resp.status(400).send(err);
            });
        }
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
    return importConstruct(id, buffer)
      .then((roll) => {
        if (! _.isString(roll)) {
          resp.status(200).json({roots: roll.roots, blocks: roll.blocks});
        } else {
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
