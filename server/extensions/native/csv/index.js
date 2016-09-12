import express from 'express';
import bodyParser from 'body-parser';
import invariant from 'invariant';

import convertFromFile, { convertCsv } from './convert';
import importMiddleware, { mergeRollupMiddleware } from '../_shared/importMiddleware';

//GC specific
import Project from '../../../../src/models/Project';
import Block from '../../../../src/models/Block';
import * as fileSystem from '../../../../server/utils/fileSystem';
import * as filePaths from '../../../../server/utils/filePaths';
import * as persistence from '../../../../server/data/persistence';
import * as rollup from '../../../../server/data/rollup';
import { errorDoesNotExist } from '../../../../server/utils/errors';
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

/* special parameters */

router.param('projectId', (req, res, next, id) => {
  Object.assign(req, { projectId: id });
  next();
});

/* file route */

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

/* import */

router.post('/import/:format/:projectId?',
  jsonParser,
  importMiddleware,
  (req, res, next) => {
    const { noSave, returnRoll, format, projectId, files } = req;

    //future - handle multiple files. expect only one right now. need to reduce into single object before proceeding\
    const { name, string, hash, filePath, fileUrl } = files[0];

    return convertCsv(string, name, fileUrl)
      .then(converted => {
        return fileSystem.fileWrite(filePath + '-converted', converted)
          .then(() => converted);
      })
      //get maps of sequence hash and blocks, write sequences first
      .then(({ blocks, sequences }) => {
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

        const constructIds = Object.keys(allBlocks).filter(blockId => allBlocks[blockId].components.length > 0);

        const project = Project.classless({ components: constructIds });
        const roll = {
          project,
          allBlocks,
          sequences,
        };

        Object.assign(req, { roll });
        next();
      });
  },
  mergeRollupMiddleware
);

//todo
router.get('export/:projectId', permissionsMiddleware, (req, res, next) => {
  res.status(501).send();
});

export default router;
