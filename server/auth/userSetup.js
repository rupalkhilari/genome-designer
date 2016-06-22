import * as rollup from '../data/rollup';
import * as querying from '../data/querying';
import makeEgfRollup from '../../data/egf_parts/project';
import rollupWithConstruct from '../../src/utils/rollup/rollupWithConstruct';

//create the EGF project for them
const createInitialData = (user) => {
  const egfRollup = makeEgfRollup();
  console.log('[EGF ROLLUP] made rollup ' + egfRollup.project.id + ' for user ' + user.uuid);
  //console.log(egfRollup);

  const emptyProjectRollup = rollupWithConstruct(true);

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
