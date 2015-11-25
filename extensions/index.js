import express from 'express';
import bodyParser from 'body-parser';
import { runNode, getNodeDir } from './cloudRun';

const fs = require('fs');
const yaml = require('yamljs');
const writeFile = require('then-write-file')
const readMultipleFiles = require('read-multiple-files');
const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

router.post('/run/:id', jsonParser, (req, resp) => {
  const { id } = req.params;
  const inputs = req.body;
  const dir = getNodeDir(id);
  var inputFiles = {};
  var outputFiles = {};

  fs.readFile(dir + "/workflow.yaml", "utf8", (err, filestr) => {
    
    if (err) {

      console.log("Workflow.yaml could not be read: " + err);

    } else {

      var data = yaml.parse(filestr);
      //var inputs = data.inputs;
      var outputs = data.outputs;
      var outputFileNames = [];
      var i;

      //inputs      
      for (i in inputs) {
        inputFiles[ dir + "/inputs/" + i ] = inputs[i];
      }

      //outputs
      for (i=0; i < outputs.length; ++i) {
        outputFiles[ outputs[i].id ] = "";
        outputFileNames.push(dir + "/outputs/" +  outputs[i].id);
      }

      //write inputs
      var writeFiles = [];
      for (i in inputFiles)
      writeFile
      Promises.all(writeFiles(inputFiles, err => {
        if (err) {
          console.log("Input write error: " + err);
        }

        //run the node
        runNode(id).then( res => {
          //read the output files
          readMultipleFiles(outputFileNames, "utf8", (err, buffers) => {

            if (err) {
              console.log("Output read error: " + err);
            }

            //get values from files into object
            //TODO - select only json-suitable output fields
            for (var i=0; i < outputFileNames.length; ++i) {
              outputFiles[ outputs[i].id ] = buffers[i];
            }

            //return object
            resp.json(outputFiles);

          }); //readMultipleFiles
        }); //runNode
      }); //writeFiles
    }   //read yaml file successful
  }); //fs.readFile
}); //router.post


module.exports = router;
