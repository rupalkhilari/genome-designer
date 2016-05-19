import Block from '../models/Block';
import Project from '../models/Project';

const list = new Block({
  metadata: {
    name: 'List Block',
  },
  rules: {
    list: true,
    filter: {
      'metadata.egfPosition': '1',
    },
  },
});

const construct = new Block({
  metadata: {
    name: 'My Template',
  },
  rules: {
    fixed: true,
  },
  components: [list.id],
});

const proj = new Project({
  id: 'combinatorial',
  components: [construct.id],
});

export const blocks = [
  construct,
  list,
];

export const project = proj;
