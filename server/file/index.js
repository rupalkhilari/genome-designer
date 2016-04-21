import express from 'express';
import { fileRead, fileWrite, directoryMake, fileDelete} from '../utils/fileSystem';
import errorHandlingMiddleware from '../utils/errorHandlingMiddleware';

import { createFilePath } from './../utils/filePaths';

const router = express.Router(); //eslint-disable-line new-cap

router.use(errorHandlingMiddleware);

router.route('/*')
  .all((req, res, next) => {
    const url = req.params[0];
    const filePath = createFilePath(url);
    const folderPath = filePath.substring(0, filePath.lastIndexOf('/') + 1);

    Object.assign(req, {
      filePath,
      folderPath,
    });
    next();
  })
  .get((req, res, next) => {
    const { filePath } = req;

    fileRead(filePath, false)
      .then(data => res.send(data))
      .catch(err => {
        console.log('file get err', err.stack);
        next(err);
      });
  })
  .post((req, res, next) => {
    const { filePath, folderPath } = req;

    //assuming contents to be string
    let buffer = '';

    //get data in parts
    req.on('data', data => {
      buffer += data;
    });

    //received all the data
    req.on('end', () => {
      //todo - should ensure there isn't a file preventing directory creation

      directoryMake(folderPath)
        .then(() => fileWrite(filePath, buffer, false))
        .then(() => res.send(req.originalUrl))
        .catch((err) => next(err));
    });
  })
  .delete((req, res, next) => {
    const { filePath } = req;

    fileDelete(filePath)
      .then(() => res.status(200).send())
      .catch(err => next(err));
  });

export default router;
