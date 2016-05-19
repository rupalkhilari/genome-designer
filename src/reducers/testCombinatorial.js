import Block from '../models/Block';
import Project from '../models/Project';

const list = new Block({
  rules: {
    isList: true,
  },
});

const construct = new Block({
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
