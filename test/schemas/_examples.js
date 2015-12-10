import uuid from 'node-uuid';

//todo - these should be generators so IDs change

export const Block = {
  'id': uuid.v4(),
  'metadata': {
    'authors': [],
    'version': '0.0.0',
    'tags': {},
  },
  'options': [],
  'components': [],
  'rules': [],
  'notes': {},
};

export const Annotation = {
  id: uuid.v4(),
  description: 'example annotation',
  tags: {},
  optimizability: 'none',
  sequence: 'acgtagc',
};
