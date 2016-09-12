import express from 'express';
import bodyParser from 'body-parser';
import formidable from 'formidable';
import invariant from 'invariant';
import md5 from 'md5';

import convertFromFile, { convertCsv } from './convert';

//GC specific
import Project from '../../../../src/models/Project';
import Block from '../../../../src/models/Block';
import * as fileSystem from '../../../../server/utils/fileSystem';
import * as filePaths from '../../../../server/utils/filePaths';
import * as persistence from '../../../../server/data/persistence';
import * as rollup from '../../../../server/data/rollup';
import { errorDoesNotExist } from '../../../../server/utils/errors';
import resetColorSeed from '../../../../src/utils/generators/color'; //necessary?
import { permissionsMiddleware } from '../../../data/permissions';

const extensionKey = 'csv';

//make storage directory just in case...
fileSystem.directoryMake(filePaths.createStorageUrl(extensionKey));

const createFilePath = (fileName) => {
  invariant(fileName, 'need a file name');
  return filePaths.createStorageUrl(extensionKey, fileName);
};
const createFileUrl = (fileName) => {
  invariant(fileName, 'need a file name');
  return extensionKey + '/file/' + fileName;
};

//create the router
const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

//route to download files
router.get('/file/:fileId', (req, res, next) => {
  const { fileId } = req.params;

  const path = createFilePath(fileId);

  fileSystem.fileExists(path)
    .then(() => res.download(path))
    .catch(err => {
      if (err === errorDoesNotExist) {
        return res.status(404).send();
      }

      next(err);
    });
});

router.post('/import/:format/:projectId?', jsonParser, (req, res, next) => {
  const { format, projectId } = req.params;
  const noSave = req.query.hasOwnProperty('noSave') || projectId === 'convert'; //dont save sequences or project
  const returnRoll = projectId === 'convert'; //return roll at end instead of projectId

  let promise; //resolves to the files in form { name, string, hash, filePath, fileUrl }

  //depending on the type, set variables for file urls etc.
  if (format === 'string') {
    const { name, string, ...rest } = req.body;
    console.log('body');

    console.log(name, string, rest);

    const hash = md5(string);
    const filePath = createFilePath(hash);
    const fileUrl = createFileUrl(hash);

    promise = Promise.resolve([{
      name,
      string,
      hash,
      filePath,
      fileUrl,
    }]);
  } else if (format === 'file') {

    // save incoming file then read back the string data.
    // If these files turn out to be large we could modify the import functions to take
    // file names instead but for now, in memory is fine.
    const form = new formidable.IncomingForm();

    promise = new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          return reject(err);
        }
        resolve(files);
      });
    })
      .then(files => {
        //future - actually support multiple files
        return Promise.all(
          [files].map(file => {
            const tempPath = (file && file.data) ? file.data.path : null;

            if (!tempPath) {
              return Promise.reject('no file provided');
            }

            const name = file.data.name;

            return fileSystem.fileRead(tempPath, false)
              .then((string) => {
                const hash = md5(string);
                const filePath = createFilePath(hash);
                const fileUrl = createFileUrl(hash);
                return fileSystem.fileWrite(filePath, string, false)
                  .then(() => ({
                    name,
                    string,
                    hash,
                    filePath,
                    fileUrl,
                  }));
              });
          })
        );
      });
  } else {
    return res.status(404).send('unknown import format, got ' + format + ', expected string or file');
  }

  //todo - handle catch here for CSV failures
  promise
  //write the files to their proper locations + do the conversion
    .then(files => {

      console.log('fils');
      console.log(files);

      resetColorSeed();

      //future - handle multiple files. expect only one right now. need to reduce into single object before proceeding

      const { name, string, hash, filePath, fileUrl } = files[0];
      return convertCsv(string, name, fileUrl)
        .then(converted => {
          return fileSystem.fileWrite(filePath + '-converted', converted)
            .then(() => converted);
        });
    })
    //get maps of sequence hash and blocks, write sequences first
    .then(({ blocks, sequences }) => {
      console.log(blocks, sequences);

      if (noSave) {
        return Promise.resolve(blocks);
      }

      return Promise.all(Object.keys(sequences).map(sequenceMd5 => {
        const sequence = sequences[sequenceMd5];
        return sequence.length > 0 ?
          persistence.sequenceWrite(sequenceMd5, sequence) :
          Promise.resolve();
      }))
        .then(() => blocks);
    })
    .then(blocks => {
      const blockIds = Object.keys(blocks);

      if (!blockIds.length) {
        return Promise.reject('no valid blocks');
      }

      //wrap all the blocks in a construct (so they dont appear as top-level constructs), add constructs to the blocks Object

      const allBlocks = blockIds.reduce((acc, blockId) => {
        const row = blocks[blockId].metadata.csv_row;
        const fileName = blocks[blockId].metadata.csv_file;
        const name = fileName + (row > 0 ? ' - row ' + row : '');
        const construct = Block.classless({
          components: [blockId],
          metadata: {
            name,
          },
        });
        return Object.assign(acc, { [construct.id]: construct });
      }, blocks);

      return allBlocks;
    })
    .then(blocks => {
      const componentIds = Object.keys(blocks).filter(blockId => blocks[blockId].components.length > 0);

      //if no project ID, we are adding to a new project, no need to merge
      if (!projectId) {
        const project = Project.classless({ components: componentIds });
        return Promise.resolve({
          project,
          blocks,
        });
      }

      return rollup.getProjectRollup(projectId)
        .then((existingRoll) => {
          existingRoll.project.components = existingRoll.project.components.concat(componentIds);
          Object.assign(existingRoll.blocks, blocks);
          return existingRoll;
        });
    })
    .then(roll => {
      if (noSave) {
        return Promise.resolve(roll);
      }

      return rollup.writeProjectRollup(roll.project.id, roll, req.user.uuid)
        .then(() => persistence.projectSave(roll.project.id, req.user.uuid))
        .then(() => roll);
    })
    .then((roll) => {
      const response = returnRoll ?
        roll :
      { projectId: roll.project.id };

      res.status(200).json(response);
    })
    .catch(err => {
      console.log('Error in CSV Import: ' + err);
      console.log(err.stack);
      res.status(500).send(err);
    });
});

//todo
router.get('export/:projectId', permissionsMiddleware, (req, res, next) => {
  res.status(501).send();
});

export default router;
