import express from 'express';
import bodyParser from 'body-parser';
import { errorDoesNotExist } from '../utils/errors';
import listExtensions from './registry';
import loadExtension, { getExtensionInternalPath} from './loadExtension';
import errorHandlingMiddleware from '../utils/errorHandlingMiddleware';

const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json();

router.use(jsonParser);
router.use(errorHandlingMiddleware);

router.get('/list', (req, res) => {
  res.json(listExtensions);
});

router.get('/manifest/:extension', (req, res, next) => {
  const { extension } = req.params;

  loadExtension(extension)
    .then(manifest => res.json(manifest))
    .catch(err => {
      if (err === errorDoesNotExist) {
        return res.status(400).send(errorDoesNotExist);
      }
      next(err);
    });
});

if (process.env.NODE_ENV !== 'production') {
  //make the whole extension available
  router.get('/load/:extension/:filePath?', (req, res, next) => {
    const { filePath = 'index.js', extension } = req.params;
    const extensionFile = getExtensionInternalPath(extension, filePath);

    res.sendFile(extensionFile, (err) => {
      if (err) {
        console.log('got an error sending extension!', err);
        console.log(err.stack);
        //don't write headers because express may complain about them already being set
      }
      //force ending of response, since lib/response seems not to if we provide a callback
      return res.end();
    });
  });
} else {
  //only index.js files are available

  router.get('/load/:extension/:filePath?', (req, res, next) => {
    const { extension } = req.params;

    loadExtension(extension)
      .then(manifest => {
        const filePath = getExtensionInternalPath(extension);
        res.sendFile(filePath, (err) => {
          if (err) {
            console.log('error sending extension!', err);
            console.log(err.stack);
            //don't write headers because express may complain about them already being set
          }
          //force ending of response, since lib/response seems not to if we provide a callback
          return res.end();
        });
      })
      .catch(err => {
        if (err === errorDoesNotExist) {
          return res.status(404).send(errorDoesNotExist);
        }
        next(err);
      });
  });
}

export default router;
