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

import {chunk} from 'lodash';

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
      length: block.sequence.length,
      annotations: block.annotations, //you will likely have to remap these...
    },
    source: {
      id: 'genbank',
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

const createAllBlocks = (outputBlocks) => {
  const batches = chunk(Object.keys(outputBlocks), 200);

  return batches.reduce((acc, batch) => {
    return acc.then((allBlocks) => {
      return Promise.all(batch.map(block => createBlockStructureAndSaveSequence(outputBlocks[block])))
        .then((createdBatch) => {
          return allBlocks.concat(createdBatch);
        });
    });
  }, Promise.resolve([]));
};

const getNewId = (blockStructureArray, oldId) => {
  for (let i = 0, len = blockStructureArray.length; i < len; i++) {
    if (blockStructureArray[i].oldId === oldId) {
      return blockStructureArray[i].id;
    }
  }
};

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

const handleProject = (outputProject, rootBlockIds) => {
  //just get fields we want using destructuring and use them to merge
  const { name, description } = outputProject;

  return new Project(merge({}, ProjectDefinition.scaffold(), {
    components: rootBlockIds,
    metadata: {
      name,
      description,
    },
  }));
};

const exec = require('child_process').exec;
const uuid = require('node-uuid');

//todo - should validate blocks coming in / going out

const createRandomStorageFile = () => filePaths.createStorageUrl('temp-' + uuid.v4());

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

const exportProjectStructure = (project, blocks) => {
  const inputFile = createRandomStorageFile();
  const outputFile = createRandomStorageFile();
  const input = {
    project,
    blocks,
  };

  const outputFile2 = filePaths.createStorageUrl('exported_to_genbank.json');
  fileSystem.fileWrite(outputFile2, input);

  const cmd = `python ${path.resolve(__dirname, 'convert.py')} to_genbank ${inputFile} ${outputFile}`;

  return runCommand(cmd, JSON.stringify(input), inputFile, outputFile)
    .then(resStr => {
      return Promise.resolve(resStr);
    });
};

const loadSequences = (blocks) => {
  return Promise.all(
    blocks.map(block => {
      if (block.sequence.md5 && !block.sequence.sequence) {
        return persistence.sequenceGet(block.sequence.md5)
          .then(readSequence => {
            return merge({}, block, {sequence: {sequence: readSequence}});
          });
      } else {
        Promise.resolve('');
      }
    })
  );
};

export const exportProject = (project, blocks) => {
  return loadSequences(blocks)
    .then(blocksWithSequences => {
      return exportProjectStructure(project, blocksWithSequences)
        .then(exportStr => {
          return Promise.resolve(exportStr);
        });
    });
};

const readGenbankFile = (genbankString) => {
  const inputFile = createRandomStorageFile();

  const outputFile = createRandomStorageFile();

  const cmd = `python ${path.resolve(__dirname, 'convert.py')} from_genbank ${inputFile} ${outputFile}`;

  return runCommand(cmd, genbankString, inputFile, outputFile)
    .then(resStr => {
      try {
        const res = JSON.parse(resStr);
        return Promise.resolve(res);
      } catch (err) {
        return Promise.reject(err);
      }
    });
};

const handleBlocks = (genbankInput) => {
  return readGenbankFile(genbankInput)
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
        return 'Invalid Genbank format.';
      }
    });
};

export const importProject = (gbstr) => {
  return handleBlocks(gbstr)
    .then((result) => {
      if (_.isString(result)) {
        return result;
      }
      const resProject = handleProject(result.project, result.rootBlocks);

      const outputFile = filePaths.createStorageUrl('imported_from_genbank.json');
      fileSystem.fileWrite(outputFile, {project: resProject, blocks: result.blocks});
      return {project: resProject, blocks: result.blocks};
    });
};


export const importConstruct = (genbankString) => {
  return handleBlocks(genbankString)
    .then((rawProjectRootsAndBlocks) => {
      if (_.isString(rawProjectRootsAndBlocks)) {
        return rawProjectRootsAndBlocks;
      }
      return {roots: rawProjectRootsAndBlocks.rootBlocks, blocks: rawProjectRootsAndBlocks.blocks};
    });
};

