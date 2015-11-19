import uuid from 'uuid';

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
  description: 'example annotation',
  tags: {},
  optimizability: 'none',
  sequence: 'acgtagc',
};
