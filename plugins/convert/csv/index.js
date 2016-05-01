import * as filePaths from '../../../server/utils/filePaths';
import * as fileSystem from '../../../server/utils/fileSystem';
import path from 'path';
import Project from '../../../src/models/Project';
import Block from '../../../src/models/Block';
import merge from 'lodash.merge';
import _ from 'lodash';
import BlockDefinition from '../../../src/schemas/Block';
import ProjectDefinition from '../../../src/schemas/Project';
import md5 from 'md5';
import * as persistence from '../../../server/data/persistence';

import {chunk, cloneDeep} from 'lodash';

const exec = require('child_process').exec;
const uuid = require('node-uuid');

//////////////////////////////////////////////////////////////
// COMMON
//////////////////////////////////////////////////////////////
const createRandomStorageFile = () => filePaths.createStorageUrl('temp-' + uuid.v4());

// Run an external command and return the data in the specified output file
const runCommand = (command, input, inputFile, outputFile) => {
  return fileSystem.fileWrite(inputFile, input, false)
    .then(() => {
      return new Promise((resolve, reject) => {
        exec(command, (err, stdout) => {
          if (err) {
            reject(err);
          }
          else resolve(stdout);
        });
      });
    })
    .then(() => fileSystem.fileRead(outputFile, false));
};

//////////////////////////////////////////////////////////////
// ROUTINES USED BY IMPORT
//////////////////////////////////////////////////////////////
// Create a GD block given a structure coming from Python
// Also saves the sequence and stores the MD5 in the block
const createBlockStructureAndSaveSequence = (block) => {
  // generate a valid block scaffold. This is similar to calling new Block(),
  // but a bit more light weight and easier to work with (models are frozen so you cannot edit them)
  const scaffold = BlockDefinition.scaffold();

  //get the sequence md5
  const sequenceMd5 = block.sequence.sequence ? md5(block.sequence.sequence) : '';

  //reassign values
  const toMerge = {
    metadata: block.metadata,
    sequence: {
      md5: sequenceMd5,
      length: block.sequence.sequence.length,
    },
    source: {
      id: 'csv',
    },
    rules: block.rules,
  };

  //be sure to pass in empty project first, so you arent overwriting scaffold each time
  const outputBlock = merge({}, scaffold, toMerge);

  //promise, for writing sequence if we have one, or just immediately resolve if we dont
  const sequencePromise = sequenceMd5 ?
    persistence.sequenceWrite(sequenceMd5, block.sequence.sequence) :
    Promise.resolve();

  //return promise which will resolve with block once done
  return sequencePromise.then(() => ({
    block: outputBlock,
    id: outputBlock.id,
    oldId: block.id,
    children: block.components,
  }));
};

// Creates a structure of GD blocks given the structure coming from Python
// We chunk here because otherwise the OS complains of too many open files
const createAllBlocks = (outputBlocks) => {
  const batches = chunk(Object.keys(outputBlocks), 200);

  return batches.reduce((acc, batch) => {
    return acc.then((allBlocks) => {
      return Promise.all(batch.map(block_id => createBlockStructureAndSaveSequence(outputBlocks[block_id])))
        .then((createdBatch) => {
          return allBlocks.concat(createdBatch);
        });
    });
  }, Promise.resolve([]));
};

// Given an old ID, returns the new ID for a block
const getNewId = (blockStructureArray, oldId) => {
  for (let i = 0, len = blockStructureArray.length; i < len; i++) {
    if (blockStructureArray[i].oldId === oldId) {
      return blockStructureArray[i].id;
    }
  }
};

// Takes a block structure and sets up the hierarchy through GD ids.
// This is necessary because Python returns ids that are not produced by GD.
const remapHierarchy = (blockArray) => {
  return blockArray.map(blockStructure => {
    const newBlock = blockStructure.block;
    blockStructure.children.map(oldChildId => {
      const newid = getNewId(blockArray, oldChildId);
      newBlock.components.push(newid);
    });
    return new Block(newBlock);
  });
};

// Converts an input project structure (from Python) into GD format
const handleProject = (outputProject, rootBlockIds) => {
  //just get fields we want using destructuring and use them to merge
  const d = new Date();
  const projectName = 'CSV Import ' + d.toLocaleString();
  const { name } = projectName;

  return new Project(merge({}, ProjectDefinition.scaffold(), {
    components: rootBlockIds,
    metadata: {
      name,
    },
  }));
};

// Reads a cvs file and returns a project structure and all the blocks
// These return structures are NOT in GD format.
const readCvsFile = (cvsString) => {
  const inputFile = createRandomStorageFile();
  const outputFile = createRandomStorageFile();

  const cmd = `python ${path.resolve(__dirname, 'convert.py')} from_csv ${inputFile} ${outputFile}`;
  return runCommand(cmd, cvsString, inputFile, outputFile)
    .then(resStr => {
      try {
        const res = JSON.parse(resStr);
        return Promise.resolve(res);
      } catch (err) {
        return Promise.reject(err);
      }
    })
    .catch(err => {
      console.log('ERROR IN PYTHON');
      console.log(err);
    });
};

// Creates a rough project structure (not in GD format yet!) and a list of blocks from a cvs file
const handleBlocks = (cvsInput) => {
  // remove the form data at the start of the string
  let withoutFormHeaders = cvsInput.substr(cvsInput.indexOf('Name,Description,SBOL Type,Background Color,Sequence'));
  // remove form boundary data at end of string
  withoutFormHeaders = withoutFormHeaders.substr(0, withoutFormHeaders.indexOf('------WebKitFormBoundary'));
  console.log('PARSE CSV:', withoutFormHeaders);
  return readCvsFile(withoutFormHeaders)
    .then(result => {
      if (result && result.project && result.blocks &&
        result.project.components && result.project.components.length > 0) {
        return createAllBlocks(result.blocks)
          .then(blocksWithOldIds => {
            const remappedBlocksArray = remapHierarchy(blocksWithOldIds);
            const newRootBlocks = result.project.components.map((oldBlockId) => {
              return getNewId(blocksWithOldIds, oldBlockId);
            });
            return {project: result.project, rootBlocks: newRootBlocks, blocks: remappedBlocksArray};
          });
      }
      else {
        console.log("INVALID CSV");
        return 'Invalid cvs format.';
      }
    });
};

//////////////////////////////////////////////////////////////
// IMPORT
//////////////////////////////////////////////////////////////
// Import project and construct/s from cvs
// Returns a project structure and the list of all blocks
export const importProject = (cvsstr) => {
  return handleBlocks(cvsstr)
    .then((result) => {
      if (_.isString(result)) {
        return result;
      }
      const resProject = handleProject(result.project, result.rootBlocks);

      const outputFile = filePaths.createStorageUrl('imported_from_cvs.json');
      fileSystem.fileWrite(outputFile, {project: resProject, blocks: result.blocks});
      return {project: resProject, blocks: result.blocks};
    });
};

// Import only construct/s from cvs
// Returns a list of block ids that represent the constructs, and the list of all blocks
export const importConstruct = (cvsString) => {
  return handleBlocks(cvsString)
    .then((rawProjectRootsAndBlocks) => {
      if (_.isString(rawProjectRootsAndBlocks)) {
        return rawProjectRootsAndBlocks;
      }
      return {roots: rawProjectRootsAndBlocks.rootBlocks, blocks: rawProjectRootsAndBlocks.blocks};
    });
};
