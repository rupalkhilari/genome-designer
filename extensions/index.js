import express from 'express';
import bodyParser from 'body-parser';
import { runNode, getNodeDir } from './cloudRun';
import { validateSessionKey } from '../server/validation';

const fs = require('fs');
const yaml = require('yamljs');
const readMultipleFiles = require('read-multiple-files');
const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

router.post('/run/:id', jsonParser, (req, resp) => {
  const { id } = req.params;
  const inputs = req.body;
  const dir = getNodeDir(id);
  const key = req.headers["session-key"];
  var outputFiles = {};

  validateSessionKey(key).then( valid => {

    fs.readFile(dir + "/workflow.yaml", "utf8", (err, filestr) => {
      
      if (err) {

        console.log("Workflow.yaml could not be read: " + err);

      } else {

        var data = yaml.parse(filestr);
        //var inputs = data.inputs;
        var outputs = data.outputs;
        var outputFileNames = [];
        var i;

        //inputs - write files using promises     
        var inputFileWrites = [];
        for (i in inputs) {
          inputFileWrites.push(
            new Promise((resolve, reject) => {
              fs.writeFile( dir + "/inputs/" + i, inputs[i] , err => {
                if (err) {
                  reject(err.message);
                } else {
                  resolve(dir + "/inputs/" + i);
                }
              }); //fs.writeFile
            }));
        }

        //outputs
        for (i=0; i < outputs.length; ++i) {
          outputFiles[ outputs[i].id ] = "";
          outputFileNames.push(dir + "/outputs/" +  outputs[i].id);
        }

        
        Promise.all(inputFileWrites).then(result => {
          console.log("input files written");
          if (!result) {
            console.log("Input write error");
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
  }); //if valid session key

}); //router.post


module.exports = router;
