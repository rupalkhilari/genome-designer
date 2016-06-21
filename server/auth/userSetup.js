import Block from '../../src/models/Block';
import Project from '../../src/models/Project';
import * as rollup from '../data/rollup';
import * as querying from '../data/querying';
import makeEgfRollup from '../../data/egf_parts/project';
import { createRollupFromArray } from '../../server/data/rollup';

const makeEmptyRollup = () => {
  //use classless when creating so they are not frozen. If they are frozen, may run into issues when writing
  const construct = Block.classless();
  const project = Project.classless({
    components: [construct.id],
  });

  return createRollupFromArray(project, construct);
};

//create the EGF project for them
const createInitialData = (user) => {
  console.log('[EGF ROLLUP] making rollup ' + egfRollup.project.id + ' for user ' + user.uuid);
  const egfRollup = makeEgfRollup();
  //console.log(egfRollup);

  const emptyProjectRollup = makeEmptyRollup();

  return Promise.all([
    rollup.writeProjectRollup(emptyProjectRollup.project.id, emptyProjectRollup, user.uuid),
    rollup.writeProjectRollup(egfRollup.project.id, egfRollup, user.uuid),
  ]);
};

const checkUserSetup = (user) => {
  return querying.listProjectsWithAccess(user.uuid)
    .then(projects => {
      if (!projects.length) {
        // create rollups return ID of empty project
        return createInitialData(user)
          .then(rollups => rollups[0].project.id);
      }
    });
};

export default checkUserSetup;
