import express from 'express';
import bodyParser from 'body-parser';
import { authenticationMiddleware } from '../../server/utils/authentication';
import { getPlugin } from '../loadPlugin';
const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

const namespace = 'search';

router.use(authenticationMiddleware);

function searchString(id, str, max) {
  return getPlugin(namespace, id)
    .then(mod => {
      return new Promise((resolve, reject) => {
        if (mod && mod.search) {
          try {
            mod.search(str, max)
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
          reject('No search option named ' + id);
        }
      });
    });
}

router.post('/:id', jsonParser, (req, resp) => {
  const { id } = req.params;
  const data = req.body;
  searchString(id, data.query, data.max)
    .then(res => {
      resp.json(res);
    })
    .catch(err => {
      resp.status(500).send(err);
    });
});

//export these functions for testing purpose
router.searchString = searchString;

module.exports = router;
