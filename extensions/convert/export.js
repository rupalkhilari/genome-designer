import express from 'express';
import bodyParser from 'body-parser';
import { sessionMiddleware } from '../../server/utils/authentication';
import { load as loadExtensions } from '../requireExtensions';
const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

const normalizedPath = require('path').join(__dirname, '.');
const retval = loadExtensions(normalizedPath);
const extensions = retval.extensions;
const manifests = retval.manifests;

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


router.get('/manifests', jsonParser, (req, resp) => {
  //const key = req.headers.sessionkey;
  //const header = {'sessionkey': key, 'host': 'http://0.0.0.0:3000'};
  resp.json(manifests);
});


//export these functions for testing purpose
router.exportBlock = exportBlock;
router.exportProject = exportProject;

module.exports = router;
