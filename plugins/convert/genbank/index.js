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
  const sequenceMd5 = block.sequence ? md5(block.sequence) : '';

  //reassign values
  const toMerge = {
    metadata: block.metadata,
    sequence: {
      md5: sequenceMd5,
      annotations: block.annotations, //you will likely have to remap these...
    },
    source: {
      id: 'genbank',
    },
    rules: block.rules,
  };

  //be sure to pass in empty project first, so you arent overwriting scaffold each time
  const outputBlock = merge({}, scaffold, toMerge);

  //if you want to validate it afterwards (probably for debugging)
  //This function will log errors about what fields failed validation
  //you can pass in a second argument of true for this to throw if you want a stack trace
  const isValid = BlockDefinition.validate(outputBlock);

  //note that if you reject this promise, then Promise.all will reject as well. You probably dont want to do that.
  //None of the blocks will be available on what is returned. Dont want you to run into that.
  //Really, you probably just dont want this to happen ever...
  if (!isValid) {
    //return Promise.reject('block was not valid:', block);
  }

  //promise, for writing sequence if we have one, or just immediately resolve if we dont
  const sequencePromise = sequenceMd5 ?
    persistence.sequenceWrite(sequenceMd5, block.sequence) :
    Promise.resolve();

  //return promise which will resolve with block once done
  return sequencePromise.then(() => ({
    block: outputBlock,
    id: outputBlock.id,
    oldId: block.id,
    children: block.components
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
  for (var i = 0, len = blockStructureArray.length; i < len; i++) {
    if (blockStructureArray[i].oldId === oldId) {
      return blockStructureArray[i].id;
    }
  }
  ;
};

const remapHierarchy = (blockArray) => {
  return blockArray.map(blockStructure => {
    var newBlock = blockStructure.block;
    blockStructure.children.map(oldChildId => {
      var newid = getNewId(blockArray, oldChildId);
      newBlock.components.push(newid);
    });
    return new Block(newBlock);
  });
};

const handleProject = (outputProject, root_block_ids) => {
  //just get fields we want using destructuring and use them to merge
  const { name, description } = outputProject;

  return new Project(merge({}, ProjectDefinition.scaffold(), {
    components: root_block_ids,
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
            console.log('Error executing command: ' + err);
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

  const cmd = `python ${path.resolve(__dirname, 'convert.py')} to_genbank ${inputFile} ${outputFile}`;

  return runCommand(cmd, JSON.stringify(input), inputFile, outputFile)
    .then(resStr => {
      return Promise.resolve(resStr);
    });
};

const loadSequences = (blocks) => {
  return Promise.all(
    Object.keys(blocks).map(key => {
      //promise, for writing sequence if we have one, or just immediately resolve if we dont
      const sequencePromise = blocks[key].sequence.md5 ?
        persistence.sequenceGet(blocks[key].sequence.md5) :
        Promise.resolve('');
    })
  );
};

export const exportProject = (project, blocks) => {
  return loadSequences(blocks)
    .then(blocks_with_sequences => {
      return exportProjectStructure(project, blocks)
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
            const remapped_blocks_array = remapHierarchy(blocksWithOldIds);
            const newRootBlocks = result.project.components.map((oldBlockId) => {
              return getNewId(blocksWithOldIds, oldBlockId);
            });
            return {project: result.project, rootBlocks: newRootBlocks, blocks: remapped_blocks_array};
          });
      }
      else {
        return 'Invalid Genbank format.';
      }
    });
}

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
}


export const importConstruct = (genbankString) => {
  return handleBlocks(genbankString)
    .then((rawProjectRootsAndBlocks) => {
      if (_.isString(rawProjectRootsAndBlocks)) {
        return rawProjectRootsAndBlocks;
      }
      return {roots: rawProjectRootsAndBlocks.rootBlocks, blocks: rawProjectRootsAndBlocks.blocks};
    });
};