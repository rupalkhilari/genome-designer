import Block from '../../src/models/Block';
import Project from '../../src/models/Project';

import { templates, blocks as templateBlocks } from './templates';
import { examples, blocks as exampleBlocks } from './examples';

//clone everything so that IDs are unique
//even though blocks are frozen, they are not currently associated with a project, so should have unique IDs within this project
const makeBlocks = () => {
  return {
    constructs: [
      ...templates.map(template => template.clone(false)),
      ...examples.map(example => example.clone(false)),
    ],
    blocks: [
      ...templateBlocks.map(block => block.clone(false)),
      ...exampleBlocks.map(block => block.clone(false)),
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
