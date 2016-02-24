import Project from '../../src/models/Project';
import Block from '../../src/models/Block';

import * as rollup from '../../server/data/rollup';

/*
Returns a Rollup in the form { project: project, blocks: [P,A,B,C,D,E] }
 */
export const createExampleRollup = () => {
  /**
   blocks:
   P - A - C
   . . . - D
   . - B - E
   */

  const blockC = new Block();
  const blockD = new Block();
  const blockE = new Block();
  const blockB = new Block({
    components: [blockE.id],
  });
  const blockA = new Block({
    components: [blockC.id, blockD.id],
  });
  const blockP = new Block({
    components: [blockA.id, blockB.id],
  });
  const project = new Project({
    components: [blockP.id],
  });
  const roll = rollup.createRollup(project, blockP, blockA, blockB, blockC, blockD, blockE);
  return roll;
};
