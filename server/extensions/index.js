import express from 'express';
import bodyParser from 'body-parser';
import { errorDoesNotExist } from '../utils/errors';
import { authenticationMiddleware } from '../utils/authentication';
import listExtensions from './registry';
import loadExtension, { getExtensionInternalPath} from './loadExtension';

const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json();

router.use(authenticationMiddleware);
router.use(jsonParser);

router.get('/list', (req, res) => {
  res.json(listExtensions);
});

router.get('/manifest/:extension', (req, res) => {
  const { extension } = req.params;

  loadExtension(extension)
    .then(manifest => {
      res.json(manifest);
    })
    .catch(err => {
      if (err === errorDoesNotExist) {
        res.status(400).send(errorDoesNotExist);
      }
      res.status(500).err(err);
    });
});

if (process.env.NODE_ENV !== 'production') {
  //make the whole extension available
  router.get('/load/:extension/:filePath?', (req, res) => {
    const { filePath = 'index.js', extension } = req.params;
    const extensionFile = getExtensionInternalPath(extension, filePath);

    res.sendFile(extensionFile, (err) => {
      if (err) {
        res.status(err.status).end();
      }
    });
  });
} else {
  //only index.js files are available

  router.get('/load/:extension/:filePath?', (req, res) => {
    const { extension } = req.params;

    loadExtension(extension)
      .then(manifest => {
        const filePath = getExtensionInternalPath(extension);
        res.sendFile(filePath, (err) => {
          if (err) {
            res.status(err.status).end();
          }
          //sent successfully
        });
      })
      .catch(err => {
        if (err === errorDoesNotExist) {
          res.status(400).send(errorDoesNotExist);
        }
        res.status(500).err(err);
      });
  });
}

export default router;
