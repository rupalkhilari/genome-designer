import express from 'express';
import bodyParser from 'body-parser';
import { runNode } from './runNode';
import { sessionMiddleware } from '../../server/utils/authentication';

const mkpath = require('mkpath');
const fs = require('fs'), path = require('path');
const yaml = require('yamljs');
const readMultipleFiles = require('read-multiple-files');
const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});


/*
Helper
*/
function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

router.use(sessionMiddleware);

router.post('/:id', jsonParser, (req, resp) => {
  const { id } = req.params;
  const fileUrls = req.body;
  const key = req.headers["sessionkey"];

  runNode(id, fileUrls)
    .then( result => {
      resp.json(result);
    })
    .catch( err => {
      resp.status(500).send(err);
    });
}); //router.post


module.exports = router;
