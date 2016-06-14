import Block from '../../src/models/Block';
import Project from '../../src/models/Project';

import { templates, blocks as templateBlocks } from './templates';
import { examples, blocks as exampleBlocks } from './examples';

export const project = new Project({
  metadata: {
    name: 'EGF Sample Templates',
  },
  components: [
    ...templates.map(template => template.id),
    ...examples.map(example => example.id),
  ],
});

export const blocks = [
  ...templates,
  ...templateBlocks,
  ...examples,
  ...exampleBlocks,
];

export default {
  project,
  blocks,
};
