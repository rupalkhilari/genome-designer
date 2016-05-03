import express from 'express';
import bodyParser from 'body-parser';
import {getPlugin} from '../loadPlugin';
import * as persistence from '../../server/data/persistence';
import * as rollup from '../../server/data/rollup';
import _ from 'lodash';
import fs from 'fs';
import formidable from 'formidable';

const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

const namespace = 'convert';

function callImportFunction(funcName, pluginId, data) {
  return getPlugin(namespace, pluginId)
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
        reject('No import option named ' + pluginId + ' for projects');
      }
    });
  });
}

function importProject(pluginId, data) {
  return callImportFunction('importProject', pluginId, data);
}

//can pass :projectId = 'convert' to just convert genbank file directly, and not write to memory
router.post('/:pluginId/:projectId?', jsonParser, (req, resp, next) => {
  const {pluginId, projectId} = req.params;

  // needed for genbank without a project.
  if (projectId === 'convert') {
    let buffer = '';
    req.on('data', data => {
      buffer += data;
    });
    req.on('end', () => {
      return callImportFunction('convert', pluginId, buffer)
        .then(converted => resp.status(200).json(converted))
        .catch(err => next(err));
    });
  } else {

      // save incoming file then read back the string data.
      // If these files turn out to be large we could modify the import functions to take
      // file names instead but for now, in memory is fine.
      const form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {

        fs.readFile(files.data.path, 'utf8', (err, data) => {

          return importProject(pluginId, data)
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
    }
});

//export these functions for testing purpose
router.importProject = importProject;

module.exports = router;
