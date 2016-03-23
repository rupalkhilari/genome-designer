import * as filePaths from '../../../server/utils/filePaths';
import * as fileSystem from '../../../server/utils/fileSystem';
import path from 'path';
import Project from '../../../src/models/Project';
import Block from '../../../src/models/Block';
import merge from 'lodash.merge'
import BlockDefinition from '../../../src/schemas/Block';
import ProjectDefinition from '../../../src/schemas/Project';
import md5 from 'md5';
import * as persistence from '../../../server/data/persistence';

//data massaging
const handleBlocks = (outputBlocks) => {
  return Promise.all(
    Object.keys(outputBlocks).map(key => {
      // generate a valid block scaffold. This is similar to calling new Block(),
      // but a bit more light weight and easier to work with (models are frozen so you cannot edit them)
      const scaffold = BlockDefinition.scaffold();
      const outputBlock = outputBlocks[key];

      //get the sequence md5
      const sequenceMd5 = outputBlock.sequence.sequence ? md5(outputBlock.sequence.sequence) : '';

      //reassign values
      const toMerge = {
        metadata: outputBlock.metadata,
        sequence: {
          md5: sequenceMd5,
          annotations: outputBlock.annotations,
          length: outputBlock.sequence.length,
        },
        source: {
          id: 'genbank',
        },
        rules: outputBlock.rules,
      };

      //be sure to pass in empty project first, so you arent overwriting scaffold each time
      const block = merge({}, scaffold, toMerge);

      //if you want to validate it afterwards (probably for debugging)
      //This function will log errors about what fields failed validation
      //you can pass in a second argument of true for this to throw if you want a stack trace
      const isValid = BlockDefinition.validate(block);

      //note that if you reject this promise, then Promise.all will reject as well. You probably dont want to do that.
      //None of the blocks will be available on what is returned. Dont want you to run into that.
      //Really, you probably just dont want this to happen ever...
      if (!isValid) {
        //return Promise.reject('block was not valid:', block);
      }

      //promise, for writing sequence if we have one, or just immediately resolve if we dont
      const sequencePromise = sequenceMd5 ?
        persistence.sequenceWrite(sequenceMd5, outputBlock.sequence.sequence) :
        Promise.resolve();

      //return promise which will resolve with block once done
      return sequencePromise.then(() => ({block: block, id: block.id, oldId: key, children: outputBlocks[key].components}));
    })
  );
};

const getNewId = (blockStructureArray, oldId) => {
  for (var i = 0, len = blockStructureArray.length; i < len; i++) {
    if (blockStructureArray[i].oldId === oldId) {
      return blockStructureArray[i].id;
    }
  };
};

const remapHierarchy = (blockArray) => {
  return blockArray.map(blockStructure => {
    var newBlock = blockStructure.block;
    blockStructure.children.map(oldChildId =>  {
      var newid = getNewId(blockArray, oldChildId);
      newBlock.components.push(newid);
    });
    return newBlock;
  });
};

const handleProject = (outputProject, root_block_ids) => {
  //just get fields we want using destructuring and use them to merge
  const { name, description } = outputProject;

  return merge({}, ProjectDefinition.scaffold(), {
    components: root_block_ids,
    metadata: {
      name,
      description,
    },
  });
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

  console.log("About to export");
  console.log(JSON.stringify(input));

  const cmd = `python ${path.resolve(__dirname, 'convert.py')} to_genbank ${inputFile} ${outputFile}`;

  return runCommand(cmd, JSON.stringify(input), inputFile, outputFile)
    .then(resStr => {
        console.log("Result");
        console.log(resStr);
        return Promise.resolve(resStr);
    });
};

const loadSequences = (blocks) => {
  return Promise.all(
    Object.keys(blocks).map(key => {
      //promise, for writing sequence if we have one, or just immediately resolve if we dont
      const sequencePromise = blocks[key].sequence.sequenceMd5 ?
        persistence.sequenceGet(blocks[key].sequence.sequenceMd5) :
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

const importProjectStructure = (genbankString) => {
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

export const importProject = (gbstr) => {
  return importProjectStructure(gbstr)
    .then(result => {
      if (result && result.project && result.blocks &&
        result.project.components && result.project.components.length > 0) {
          console.log("There were originally a total blocks of: " + result.blocks.keys().length)
          return handleBlocks(result.blocks)
            .then(blocksWithOldIds => {
              console.log("After HandleBlocks: " + blocksWithOldIds.length)
              const remapped_blocks_array = remapHierarchy(blocksWithOldIds);
              console.log("And after remapping: " + remapped_blocks_array.length);
              const newRootBlocks = result.project.components.map((oldBlockId) => {
                return getNewId(blocksWithOldIds, oldBlockId);
              });
              const resProject = handleProject(result.project, newRootBlocks);
              var blocks = {};
              for (var i = 0; i < remapped_blocks_array.length; i++) {
                blocks[remapped_blocks_array[i].id] = remapped_blocks_array[i];
              };

              const outputFile = filePaths.createStorageUrl('imported_from_genbank.json');
              fileSystem.fileWrite(outputFile, { project: resProject, blocks: blocks });
              return { project: resProject, blocks: blocks };
            });
        }
      else return 'Invalid Genbank format.';
    });
};