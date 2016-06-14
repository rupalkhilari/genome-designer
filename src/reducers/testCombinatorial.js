import Block from '../models/Block';
import Project from '../models/Project';

import { templates, blocks as templateBlocks } from '../../data/egf_parts/templates';
import { examples, blocks as exampleBlocks } from '../../data/egf_parts/examples';

const proj = new Project({
  id: 'combinatorial',
  metadata: {
    name: 'Combinatorial Demo',
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

export const project = proj;
