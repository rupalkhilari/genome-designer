import { assert, expect } from 'chai';
import uuid from 'node-uuid';
import ProjectDefinition from '../../../src/schemas/Project';
import * as fileSystem from '../../../server/utils/fileSystem';
import * as filePaths from '../../../server/utils/filePaths';
import * as rollup from '../../../server/data/rollup';
import * as persistence from '../../../server/data/persistence';
import * as querying from '../../../server/data/querying';

import { createExampleRollup } from '../../utils/rollup';

describe('Server', () => {
  describe('Data', () => {
    describe.only('Querying', () => {
      const myUserId = uuid.v4();
      const myRolls = [1, 2, 3, 4].map(createExampleRollup);
      const myRollIds = myRolls.map(roll => roll.project.id);

      const otherUserId = uuid.v4();
      const otherRolls = [1, 2, 3].map(createExampleRollup);
      const otherRollIds = otherRolls.map(roll => roll.project.id);

      before(() => {
        return Promise.all([
          ...myRollIds.map((projectId, index) => {
            return rollup.writeProjectRollup(projectId, myRolls[index], myUserId);
          }),
          ...otherRollIds.map((projectId, index) => {
            return rollup.writeProjectRollup(projectId, otherRolls[index], otherUserId);
          }),
        ]);
      });

      it('before() should have written properly', () => {
        const directory = filePaths.createProjectsDirectoryPath();
        return fileSystem.directoryContents(directory)
          .then(contents => {
            assert(myRollIds.every(id => contents.indexOf(id) >= 0), 'my rolls not all written');
            assert(otherRollIds.every(id => contents.indexOf(id) >= 0), 'other rolls not all written');
          });
      });

      it('findProjectFromBlock() finds project ID given block ID', () => {
        const firstRollup = myRolls[0];
        const { project: firstProject, blocks: firstBlocks } = firstRollup;
        const secondRollup = otherRolls[2];
        const { project: secondProject, blocks: secondBlocks } = secondRollup;

        return Promise.all([
          ...firstBlocks.map(block => {
            return querying.findProjectFromBlock(block.id)
              .then(projectId => {
                expect(projectId).to.equal(firstProject.id);
              });
          }),
          ...secondBlocks.map(block => {
            return querying.findProjectFromBlock(block.id)
              .then(projectId => {
                expect(projectId).to.equal(secondProject.id);
              });
          }),
        ]);
      });

      it('listProjectsWithAccess() limits by user ID', () => {
        return querying.listProjectsWithAccess(myUserId)
          .then(projects => {
            expect(projects.length).to.equal(myRollIds.length);
            assert(projects.every(projectId => myRollIds.indexOf(projectId) >= 0), 'wrong project was returned..');
          });
      });

      it('getAllProjectManifests() returns project manifests user can access', () => {
        return querying.listProjectsWithAccess(myUserId)
        .then(accessibleProjects => {
          return querying.getAllProjectManifests(myUserId)
            .then(manifests => {
              expect(manifests.length).to.equal(accessibleProjects.length);
              assert(manifests.every(manifest => ProjectDefinition.validate(manifest, true)), 'manifests not in valid format');
            });
        });
      });
    });
  });
});
