import express from 'express';
import formidable from 'formidable';
import invariant from 'invariant';
import md5 from 'md5';

//GC specific
import Project from '../../../../src/models/Project';
import Block from '../../../../src/models/Block';
import * as fileSystem from '../../../../server/utils/fileSystem';
import * as filePaths from '../../../../server/utils/filePaths';
import * as persistence from '../../../../server/data/persistence';
import * as rollup from '../../../../server/data/rollup';
import { errorDoesNotExist } from '../../../../server/utils/errors';
import { merge, filter } from 'lodash';
import resetColorSeed from '../../../../src/utils/generators/color'; //necessary?
import { permissionsMiddleware } from '../../../data/permissions';

import importMiddleware, { mergeRollupMiddleware } from '../_shared/importMiddleware';

//genbank specific
import { convert, importProject, exportProject, exportConstruct } from './convert';

const extensionKey = 'genbank';

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

router.param('projectId', (req, res, next, id) => {
  Object.assign(req, { projectId: id });
  next();
});

/***** FILES ******/

//todo - deprecate -- use file path actually written in importMiddleware
//todo - ensure genbank conversion actually writes the file to the block

//route to download genbank files
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

/***** EXPORT ******/

router.get('/export/blocks/:projectId/:blockIdList', permissionsMiddleware, (req, res, next) => {
  const { projectId, blockIdList } = req.params;
  const blockIds = blockIdList.split(',');

  console.log(`exporting blocks ${blockIdList} from ${projectId} (${req.user.uuid})`);

  rollup.getProjectRollup(projectId)
    .then(roll => {
      const blocks = blockIds.map(blockId => roll.blocks[blockId]);
      invariant(blocks.every(block => block.sequence.md5), 'some blocks dont have md5');

      const name = (roll.project.metadata.name || roll.project.id) + '.gb';

      const construct = Block.classless({
        metadata: {
          name,
        },
        components: blocks.map(block => block.id),
      });
      const project = Project.classless(Object.assign(roll.project, {
        components: [construct.id],
      }));

      const partialRoll = {
        project,
        blocks: blocks.reduce((acc, block) => {
          return Object.assign(acc, {
            [block.id]: block,
          });
        }, {
          [construct.id]: construct,
        }),
      };

      console.log('Exporting 1');
      console.log(JSON.stringify({ roll: partialRoll, constructId: construct.id }));

      exportConstruct({ roll: partialRoll, constructId: construct.id })
        .then(fileContents => {
          res.set({
            'Content-Disposition': `attachment; filename="${roll.project.id}.fasta"`,
          });
          res.send(fileContents);
        });
    })
    .catch(err => {
      console.log('Error!', err);
      res.status(500).send(err);
    });
});

router.post('/export/:projectId/:constructId?', permissionsMiddleware, (req, res, next) => {
  const { projectId, constructId } = req.params;
  const options = req.body;

  console.log(`exporting construct ${constructId} from ${projectId} (${req.user.uuid})`);
  console.log(options);

  rollup.getProjectRollup(projectId)
    .then(roll => {
      const name = (roll.project.metadata.name ? roll.project.metadata.name : roll.project.id) + '.gb';

      const promise = !!constructId ?
        exportConstruct({ roll, constructId }) :
        exportProject(roll);

      return promise
        .then(result => {

          console.log('Exporting 2');
          console.log(JSON.stringify({ roll, constructId }));

          res.attachment(name);
          res.status(200).send(result);
        });
    })
    .catch(err => {
      console.log('Error!', err);
      res.status(500).send(err);
    });
});

/***** IMPORT ******/

//todo - ensure got genbank
router.post('/import/:format/:projectId?',
  importMiddleware,
  (req, res, next) => {
    const { noSave, returnRoll, format, projectId, files } = req;
    const { constructsOnly } = req.body;

    console.log(`converting genbank (${req.user.uuid}) @ ${files.map(file => file.filePath).join(', ')}`);

    //future - handle multiple files. expect only one right now. need to reduce into single object before proceeding\
    const { name, string, hash, filePath, fileUrl } = files[0];

    //todo - unify
    if (projectId === 'convert') {
      return convert(filePath)
        .then(converted => {
          const roots = converted.roots;
          const rootBlocks = filter(converted.blocks, (block, blockId) => roots.indexOf(blockId) >= 0);
          const payload = constructsOnly ?
          { roots, blocks: rootBlocks } :
            converted;

          console.log('Converting Import');
          console.log(JSON.stringify(payload));

          res.status(200).json(payload);
        })
        .catch(err => next(err));
    }

    return importProject(filePath)
    //wrap all the childless blocks in a construct (so they dont appear as top-level constructs), update rollup with construct Ids
      .then(roll => {
        const blockIds = Object.keys(roll.blocks);

        if (!blockIds.length) {
          return Promise.reject('no valid blocks');
        }

        const childlessBlockIds = roll.project.components.filter(blockId => roll.blocks[blockId].components.length === 0);

        const wrapperConstructs = childlessBlockIds.reduce((acc, blockId, index) => {
          const name = importedName + (index > 0 ? ' - Construct ' + (index + 1) : '');
          const construct = Block.classless({
            components: [blockId],
            metadata: {
              name,
            },
          });
          return Object.assign(acc, { [construct.id]: construct });
        }, {});

        //add constructs to rollup of blocks
        Object.assign(roll.blocks, wrapperConstructs);

        //update project components to use wrapped constructs and replace childless blocks
        roll.project.components = [
          ...roll.project.components.filter(blockId => childlessBlockIds.indexOf(blockId) < 0),
          ...Object.keys(wrapperConstructs),
        ];

        return roll;
      })
      .then(roll => {
        return fileSystem.fileWrite(filePath + '-converted', roll)
          .then(() => {
            Object.assign(req, { roll });
            next();
          });
      })
      .catch((err) => {
        console.log('error in Genbank conversion', err);
        console.log(err.stack);
        next(err);
      });
  },
  mergeRollupMiddleware
);

router.all('*', (req, res) => res.status(404).send('route not found'));

export default router;
