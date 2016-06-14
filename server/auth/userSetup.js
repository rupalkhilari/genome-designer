import * as rollup from '../data/rollup';
import * as querying from '../data/querying';
import egfRollup from '../../data/egf_parts/project';

//create the EGF project for them
const createInitialData = (user) => {
  return rollup.writeProjectRollup(egfRollup.project.id, egfRollup, user.uuid);
};

const checkUserSetup = (req, res, next) => {
  //todo - only login and create account
  if (req.url.indexOf('/auth') !== 0) {
    return next();
  }

  console.log(req.user);

  querying.listProjectsWithAccess(req.user.uuid)
    .then(projects => {
      if (!projects.length) {
        return createInitialData(req.user);
      }
    })
    .then(() => next());
};

export default checkUserSetup;
