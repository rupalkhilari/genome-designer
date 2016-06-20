import Block from '../../src/models/Block';
import Project from '../../src/models/Project';
import { createRollupFromArray } from '../../server/data/rollup';

import { templates, blocks as templateBlocks } from './templates';
import { examples, blocks as exampleBlocks } from './examples';

//clone everything so that IDs are unique
//fixme - if clone the tempalte blocks and example blocks, need to update components: [] in list blocks
//remember to set to frozen if clone them
//use block.classless so they are JSON blobs and persistence functions can mutate them as normal
const makeBlocks = () => {
  return {
    constructs: [
      ...templates.map(template => template.clone(false)).map(block => Block.classless(block)),
      ...examples.map(example => example.clone(false)).map(block => Block.classless(block)),
    ],
    blocks: [
      ...templateBlocks.map(block => Block.classless(block)),
      ...exampleBlocks.map(block => Block.classless(block)),
    ],
  };
};

const makeProject = (blockIds) => Project.classless({
  isSample: true,
  metadata: {
    name: 'EGF Sample Templates',
  },
  components: blockIds,
});

//make the blocks, make the project, return the rollup
//note that project ID will be set when write the rollup, so dont need to handle that here explicitly
export default function makeEgfRollup() {
  const blocks = makeBlocks();
  const blockIds = blocks.constructs.map(block => block.id);
  const project = makeProject(blockIds);

  return createRollupFromArray(project, ...blocks.constructs, ...blocks.blocks);
}
