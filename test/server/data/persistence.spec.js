import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import { exec } from 'child_process'; //todo - promise version
import * as filePaths from '../../../server/data/filePaths';
import { fileExists, fileRead, fileWrite, fileDelete, directoryMake, directoryDelete } from '../../../server/utils/fileSystem';
import Project from '../../../src/models/Project';
import Block from '../../../src/models/Block';
import * as persistence from '../../../server/data/persistence';

describe('API Data', () => {
  describe.only('persistence', function persistenceTests() {
    this.timeout(10000);

    const projectName = 'persistenceProject';
    const projectData = new Project({metadata: {name: projectName}});
    const projectId = projectData.id;
    const projectRepo = filePaths.createProjectPath(projectId);

    const blockName = 'blockA';
    const blockData = new Block({metadata: {name: blockName}});
    const blockId = blockData.id;
    const blockPath = filePaths.createBlockPath(blockId, projectId);

    const blockSequence = 'aaaaaccccccggggttttt';

    const blockPatch = {rules: {sbol: 'promoter'}};

    before((done) => {
      directoryMake(projectRepo)
      .then(() => fileWrite(path.resolve(projectRepo, filePaths.manifestPath), projectData))
      .then(() => directoryMake(blockPath))
      .then(() => fileWrite(path.resolve(blockPath, filePaths.manifestPath), blockData))
      .then(() => fileWrite(path.resolve(blockPath, filePaths.sequencePath), blockSequence, false))
      .then(() => done());
    });

    it('projectExists() rejects for non-extant project', (done) => {
      persistence.projectExists('notRealId')
        .then(() => expect(false))
        .catch(() => done());
    });

    it('projectExists() resolves for valid project', (done) => {
      persistence.projectExists(projectId)
        .then(() => done())
        .catch(done);
    });

    it('blockExists() check if block exists');
    it('projectGet() returns null if doesnt exist');
    it('projectGet() returns project if does exist');
    it('blockGet() returns null if doesnt exist');
    it('blockGet() returns block if does exist');
    it('projectCreate() creates a git repo for the project');
    it('projectCreate() creates a git commit with the initial version');
    it('projectCreate() rejects if exists');
    it('blockCreate() creates a block folder');
    it('blockCreate() rejects if exists');
    it('projectWrite() writes to an existing project');
    it('projectWrite() creates repo if necessary');
    it('projectWrite() validates the project');
    it('projectMerge() accepts a partial project');
    it('projectMerge() validates the project');
    it('blockWrite() makes the project commit');
    it('blockWrite() validates the block');
    it('blockMerge() accepts a partial block');
    it('blockMerge() validates the block');
    it('projectDelete() deletes the folder');
    it('blockDelete() deletes block');
    it('blockDelete() creates a commit');
    it('sequenceExists() checks if sequence file exists');
    it('sequenceGet() returns the sequence as a string');
    it('sequenceWrite() sets the sequence string');

    //forthcoming
    it('projectGet() accepts a version');
    it('blockGet() accepts a version');
  });
});
