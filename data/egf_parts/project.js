import Block from '../../src/models/Block';
import Project from '../../src/models/Project';

import { templates, blocks as templateBlocks } from './templates';
import { examples, blocks as exampleBlocks } from './examples';

//clone everything so that IDs are unique
//fixme - if clone the tempalte blocks and example blocks, need to update components: [] in list blocks
//remember to set to frozen if clone them
const makeBlocks = () => {
  return {
    constructs: [
      ...templates.map(template => template.clone(false)),
      ...examples.map(example => example.clone(false)),
    ],
    blocks: [
      ...templateBlocks,
      ...exampleBlocks,
    ],
  };
};

const makeProject = (blockIds) => new Project({
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

  return {
    project,
    blocks: [
      ...blocks.constructs,
      ...blocks.blocks,
    ],
  };
}
