import Project from '../../src/models/Project';
import Block from '../../src/models/Block';

import * as rollup from '../../server/data/rollup';

export const numberBlocksInRollup = 6;

/*
 Returns a Rollup in the form { project: project, blocks: [P,A,B,C,D,E] }
 */
export const createExampleRollup = () => {
  /**
   *
   * project
   *    |
   *    P
   *  /---\
   *  A     B
   * /-\   |
   * C  D  E
   */

  const blockC = Block.classless({
    rules: { sbol: 'promoter ' },
  });
  const blockD = Block.classless();
  const blockE = Block.classless();
  const blockB = Block.classless({
    components: [blockE.id],
  });
  const blockA = Block.classless({
    components: [blockC.id, blockD.id],
  });
  const blockP = Block.classless({
    components: [blockA.id, blockB.id],
  });
  const project = Project.classless({
    components: [blockP.id],
  });
  const roll = rollup.createRollup(project, blockP, blockA, blockB, blockC, blockD, blockE);
  return roll;
};
