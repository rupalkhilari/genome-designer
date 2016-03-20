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

//EXAMPLE

// you likely will call RunCommand() which will run the python, which writes a file and then reads it.
// The Python should not be responsible for correct data structure - take out scaffolds from that,
// and just return JSON objects in format which makes sense for capturing and returning the data available in Genbank files
// Pass the output to a script like this, which will scaffold + massage it for you, and write the sequence files.
// Then, pass the output of this section (a promise, which resolves to a `rollup`).

//from python, incomplete definitions:

//whatever project data you want to export.... I just have these fields so that the handling below is consistent
const outputProject = {
  name: 'blah blah',
  description: 'this is a description',
};

//array of output blocks in whatever format you choose
const outputBlocks = [
  {
    name: 'name',
    sequence: 'acggatcga',
    annotations: [],
  },
  //etc
];

//data massating
const handleBlocks = (outputBlocks) => {
  return Promise.all(
    Object.keys(outputBlocks).map(key => {
      // generate a valid block scaffold. This is similar to calling new Block(),
      // but a bit more light weight and easier to work with (models are frozen so you cannot edit them)
      const scaffold = BlockDefinition.scaffold();
      const outputBlock = outputBlocks[key];

      //get the sequence md5
      const sequenceMd5 = outputBlock.sequence ? md5(outputBlock.sequence) : '';

      //reassign values
      const toMerge = {
        metadata: outputBlock.metadata,
        sequence: {
          md5: sequenceMd5,
          annotations: outputBlock.annotations, //you will likely have to remap these...
        },
        source: {
          id: 'genbank',
        },
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
        persistence.sequenceWrite(sequenceMd5, outputBlock.sequence) :
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

const handleProject = (outputProject, root_block_id) => {
  //just get fields we want using destructuring and use them to merge
  const { name, description } = outputProject;

  return merge({}, ProjectDefinition.scaffold(), {
    components: [root_block_id],
    metadata: {
      name,
      description,
    },
  });
};

/*
 NOTES
 ______

 -- You probably dont need to touch file writing and reading too much, but if you do, you should look at fileSystem.js and filePaths.js
 They should be fairly self-explanatory, with examples available here and elsewhere.

 -- I would recommend not using the field ID, or not assigning it. Let the scaffold handle that.

 -- You can see what the schema consists of by calling describe() on the schema:
 console.log(BlockDefinition.describe());

 -- Show/Hide Store in the running app with Ctrl-h (and move it with ctrl-q)
 */

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

export const exportProject = (project, blocks) => {
  const inputFile = createRandomStorageFile();
  const outputFile = createRandomStorageFile();
  const input = {
    project,
    blocks,
  };
  const cmd = `python ${path.resolve(__dirname, 'convert.py')} to_genbank ${inputFile} ${outputFile}`;

  return runCommand(cmd, JSON.stringify(input), inputFile, outputFile);
};

export const importProject = (genbankString) => {
  const inputFile = createRandomStorageFile();
  const outputFile = createRandomStorageFile();
  console.log("Importing into: " + outputFile);
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

//todo - this is a weird syntax of {block, blocks} and should be made consistent with `rollups` or at the very least better explained why exception is made
//see format of rollup in /server/data/README.md

export const exportBlock = (block, blocks) => {
  const proj = new Project();
  blocks[block.id] = block;
  return exportProject(proj, blocks);
};

export const importBlock = (gbstr) => {
  return importProject(gbstr)
          .then(result => {
        if (result && result.project && result.blocks &&
        result.project.components && result.project.components.length > 0) {
    return handleBlocks(result.blocks)
          .then(blocksWithOldIds => {
            const blocks = remapHierarchy(blocksWithOldIds);
            const resProject = handleProject(result.project, getNewId(blocksWithOldIds, result.project.components[0]));
            return { project: resProject, blocks: blocks };
        });
  }
//  return Promise.reject('invalid input string');
});
};

export const importBlock_old = (gbstr) => {
  return importProject(gbstr)
          .then(result => {
        if (result && result.project && result.blocks &&
        result.project.components && result.project.components.length > 0) {
    const bid = result.project.components[0];
    const block = result.blocks[bid];
    return Promise.resolve({ block: block, blocks: result.blocks });
  }
  return Promise.reject('invalid input string');
});
};
