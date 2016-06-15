import Block from '../../src/models/Block';
import Project from '../../src/models/Project';

import { templates, blocks as templateBlocks } from './templates';
import { examples, blocks as exampleBlocks } from './examples';

//fixme - these should get new IDs for each user, at least for the list blocks that can be edited
const makeBlocks = () => {
  return [
    ...templates,
    ...templateBlocks,
    ...examples,
    ...exampleBlocks,
  ];
};

const makeProject = (blockIds) => new Project({
  isSample: true,
  metadata: {
    name: 'EGF Sample Templates',
  },
  components: blockIds,
});

//make the blocks, make the project, return the rollup
export default function makeEgfRollup() {
  const blocks = makeBlocks();
  const blockIds = blocks.map(block => block.id);
  const project = makeProject(blockIds);

  return {
    project,
    blocks,
  };
}
