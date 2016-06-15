import * as rollup from '../data/rollup';
import * as querying from '../data/querying';
import makeEgfRollup from '../../data/egf_parts/project';

//create the EGF project for them
const createInitialData = (user) => {
  const egfRollup = makeEgfRollup();
  return rollup.writeProjectRollup(egfRollup.project.id, egfRollup, user.uuid);
};

const checkUserSetup = (user) => {
  return querying.listProjectsWithAccess(user.uuid)
    .then(projects => {
      if (!projects.length) {
        return createInitialData(user);
      }
    })
    //fixme - sometimes this fails if the user has no projects, so lets just make in that case
    //should update listProjectsWIthAccess
    .catch((err) => createInitialData(user));
};

export default checkUserSetup;
