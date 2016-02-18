import { assert, expect } from 'chai';
import path from 'path';
import { errorInvalidModel, errorAlreadyExists, errorDoesNotExist } from '../../../server/utils/errors';
import { fileExists, fileRead, fileWrite, fileDelete, directoryExists, directoryMake, directoryDelete } from '../../../server/utils/fileSystem';

import Project from '../../../src/models/Project';
import Block from '../../../src/models/Block';

import * as filePaths from '../../../server/utils/filePaths';
import * as rollup from '../../../server/data/rollup';
import * as persistence from '../../../server/data/persistence';

describe('REST', () => {
  describe('Data', () => {
    describe.only('Rollup', () => {
      let project;
      let projectId;
      let blockP;
      let blockA;
      let blockB;
      let blockC;
      let blockD;
      let blockE;
      let roll;
      /**
       blocks:
       P - A - C
       . . . - D
       . - B - E
       */
      before(() => {
        blockC = new Block();
        blockD = new Block();
        blockE = new Block();
        blockB = new Block({
          components: [blockE.id],
        });
        blockA = new Block({
          components: [blockC.id, blockD.id],
        });
        blockP = new Block({
          components: [blockA.id, blockB.id],
        });
        project = new Project({
          components: [blockP.id],
        });
        projectId = project.id;
        roll = rollup.createRollup(project, blockP, blockA, blockB, blockC, blockD, blockE);
        return persistence.projectCreate(projectId, project);
      });

      it('createRollup() has structure { project: project, blocks: [...blocks] }', () => {
        expect(roll.project).to.eql(project);
        expect(roll.blocks.length).to.equal(6);
      });

      it('writeProjectRollup() writes a whole rollup', () => {
        return rollup.writeProjectRollup(projectId, roll)
          .then(() => Promise
              .all([
                persistence.projectGet(projectId),
                persistence.blockGet(blockA.id, projectId),
                persistence.blockGet(blockE.id, projectId),
              ])
              .then(([gotProject, gotA, gotE]) => {
                expect(gotProject).to.eql(project);
                expect(gotA).to.eql(blockA);
                expect(gotE).to.eql(blockE);
              })
          );
      });

      it('getProjectRollup() returns rollup given an ID', () => {
        return rollup.getProjectRollup(projectId)
          .then(roll => {
            expect(roll.project).to.eql(project);
            expect(roll.blocks.length).to.equal(6);
          });
      });

      it('writeProjectRollup() discards old blocks', () => {
        const blockF = new Block();
        const newComponentsBlockA = blockA.components.slice();
        newComponentsBlockA.shift(); //remove C
        newComponentsBlockA.push(blockF.id); //add F
        const editBlockA = blockA.mutate('components', newComponentsBlockA);

        const newRoll = rollup.createRollup(project, blockP, editBlockA, blockB, blockD, blockE, blockF);
        return rollup.writeProjectRollup(projectId, newRoll)
          .then(() => Promise
            .all([
              persistence.projectGet(projectId),
              persistence.blockGet(blockA.id, projectId),
              persistence.blockGet(blockF.id, projectId),
              persistence.blockGet(blockC.id, projectId),
            ])
            .then(([gotProject, gotA, gotF, gotC]) => {
              expect(gotProject).to.eql(project);
              expect(gotA).to.eql(editBlockA);
              expect(gotF).to.eql(blockF);
              expect(gotC).to.eql(null);
            })
          );
      });
    });
  });
});
