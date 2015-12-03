import express from 'express';
import bodyParser from 'body-parser';

const fs = require('fs'), path = require('path');
const yaml = require('yamljs');
const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

router.get('/inventory/:id', jsonParser, (req, resp) => {
  const { id } = req.params;
  const inputs = req.body;
  const key = req.headers["session-key"];
  var outputFiles = {};

  fs.readFile("inventory.yaml", "utf8", (err, filestr) => {
    
    if (err) {

      console.log("inventory.yaml could not be read: " + err);

    } else {

      var data = yaml.parse(filestr);
      resp.json(data);

    }  //read yaml file successful
  }); //fs.readFile
}); //router.get


module.exports = router;
