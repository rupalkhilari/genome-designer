import createInitialProjectRollup from '../../data/userInitialize/initialProject';
import * as rollup from '../data/rollup';

const setupUserData = (user) => {
  const roll = createInitialProjectRollup();
  return rollup.writeProjectRollup(roll.project.id, roll, user.uuid);
};

export default setupUserData;
