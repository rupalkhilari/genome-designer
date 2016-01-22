import express from 'express';
import bodyParser from 'body-parser';
import { sessionMiddleware } from '../../server/utils/authentication';

const router = express.Router(); //eslint-disable-line new-cap
const extensions = {};
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});
const fs = require('fs');
const normalizedPath = require('path').join(__dirname, '.');
fs.readdirSync(normalizedPath).forEach(folder => {
  if (folder.indexOf('.js') === -1) {
    extensions[folder] = require('./' + folder);
  }
});

router.use(sessionMiddleware);

function exportProject(id, input, callback) {
  if (id in extensions) {
    const mod = extensions[id];
    if (mod.exportProject) {
      try {
        mod.exportProject(input.project, input.blocks)
        .then(res => {
          callback(res);
        })
        .catch(err => {
          callback({
            error: err.message,
          });
        });
      } catch (err) {
        callback({
          error: err.message,
        });
      }
      return;
    }
  }
  callback({
    error: 'No export option named ' + id + ' for projects',
  });
}

function exportBlock(id, input, callback) {
  if (id in extensions) {
    const mod = extensions[id];
    if (mod.exportBlock) {
      try {
        mod.exportBlock(input.block, input.blocks)
        .then(res => {
          callback(res);
        })
        .catch(err => {
          callback({
            error: err.message,
          });
        });
      } catch (err) {
        callback({
          error: err.message,
        });
      }
    }
    return;
  }
  callback({
    error: 'No export option named ' + id + ' for blocks',
  });
}

router.post('/project/:id', jsonParser, (req, resp) => {
  const { id } = req.params;
  const input = req.body;
  //const key = req.headers.sessionkey;
  //const header = {'sessionkey': key, 'host': 'http://0.0.0.0:3000'};
  exportProject(id, input, res => {
    if (res.mimeType && res.data) {
      resp.contentType(res.mimeType);
      resp.write(res.data);
    } else {
      resp.json(res);
    }
  });
});

router.post('/block/:id', jsonParser, (req, resp) => {
  const { id } = req.params;
  const input = req.body;
  //const key = req.headers.sessionkey;
  //const header = {'sessionkey': key, 'host': 'http://0.0.0.0:3000'};
  exportBlock(id, input, res => {
    if (res.mimeType && res.data) {
      resp.contentType(res.mimeType);
      resp.write(res.data);
    } else {
      resp.json(res);
    }
  });
});

//export these functions for testing purpose
router.exportBlock = exportBlock;
router.exportProject = exportProject;

module.exports = router;
