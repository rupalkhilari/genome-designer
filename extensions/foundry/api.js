import express from 'express';
import bodyParser from 'body-parser';
import { sessionMiddleware } from '../../server/utils/authentication';

const fs = require('fs'), path = require('path');
const yaml = require('yamljs');
const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

const dir = 'extensions/foundry/';

router.use(sessionMiddleware);

router.get('/inventory/:id', jsonParser, (req, resp) => {
  const { id } = req.params;  
  var outputFiles = {};

  var filename = dir + id + '.json';

  fs.readFile(filename, 'utf8', (err, filestr) => {
    
    if (err) {

      console.log(filename + ' could not be read: ' + err);

    } else {

      let data = yaml.parse(filestr);
      resp.json(data);

    }  //read yaml file successful
  }); //fs.readFile
}); //router.get


module.exports = router;
