import express from 'express';
import fs from 'fs';
import mkpath from 'mkpath';

import { createStorageUrl } from './../data/filePaths';

const router = express.Router(); //eslint-disable-line new-cap

router.route(':url')
  .all((req, res, next) => {
    const url = req.params[0];
    const filePath = createStorageUrl(url);
    const folderPath = filePath.substring(0, filePath.lastIndexOf('/') + 1);

    Object.assign(req, {
      filePath,
      folderPath,
    });
    next();
  })
  .get((req, res) => {
    const { filePath } = req;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.send(data);
      }
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
      //make folder if doesn't exists
      //todo - should ensure there isn't a file preventing directory creation
      mkpath(folderPath, (err) => {
        if (err) {
          res.status(500).send(err.message);
        } else {
          //write data to file
          fs.writeFile(filePath, buffer, 'utf8', (err) => {
            if (err) {
              res.status(500).send(err.message);
            } else {
              res.send(req.originalUrl);
            }
          });
        }
      });
    });
  })
  .delete((req, res) => {
    const { filePath } = req;

    fs.unlink(filePath, (err) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(200).send();
      }
    });
  });

export default router;
