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

function searchString(id, str, max, callback) {
  if (id in extensions) {
    const mod = extensions[id];
    if (mod.search) {
      try {
        mod.search(str, max)
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
    error: 'No import option named ' + id + ' for projects',
  });
}

router.post('/:id', jsonParser, (req, resp) => {
  const { id } = req.params;
  const data = req.body;
  //const key = req.headers.sessionkey;
  //const header = {'sessionkey': key, 'host': 'http://0.0.0.0:3000'};
  searchString(id, data.query, data.max, res => { resp.json(res); });
});


router.get('/manifests', jsonParser, (req, resp) => {
  //const key = req.headers.sessionkey;
  //const header = {'sessionkey': key, 'host': 'http://0.0.0.0:3000'};
  resp.json(manifests);
});

//export these functions for testing purpose
router.searchString = searchString;

module.exports = router;
