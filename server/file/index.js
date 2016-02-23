import express from 'express';
import { fileRead, fileWrite, directoryMake, fileDelete} from '../utils/fileSystem';

import { createFilePath } from './../utils/filePaths';

const router = express.Router(); //eslint-disable-line new-cap

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
  .get((req, res) => {
    const { filePath } = req;

    fileRead(filePath, false)
      .then(data => res.send(data))
      .catch(err => {
        console.log('get err', err);
        res.status(500).err(err);
      });
  })
  .post((req, res) => {
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
        .catch((err) => res.status(500).err(err));
    });
  })
  .delete((req, res) => {
    const { filePath } = req;

    fileDelete(filePath)
      .then(() => res.status(200).send())
      .catch(err => res.status(500).err(err));
  });

export default router;
