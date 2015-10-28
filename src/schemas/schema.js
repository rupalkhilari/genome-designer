
const Author = {
  id         : 'id',
  email      : 'email',
  firstName  : 'string',
  lastName   : 'string',
  description: 'string',
  homepage   : 'URL',
  social     : {
    provider: 'string',
    username: 'string'
  }))
};


export const Metadata = {
	version    : 'version',
	authors    : 'array<Author>',
	tags       : 'hashmap',
	name       : 'string',
	description: 'string'
};


export const Annotation = {
  metadata: Metadata,
  sequence: 'sequence',
  start   : 'integer',
  end     : 'integer'
};

const Block = {
  id      : 'id',
  parent  : 'id',
  template: 'id',
  metadata: Metadata,  
  components: 'array<id>'
};

const Part = {
  id      : 'id',
  parent  : 'id',
  metadata: Metadata,
  features: 'array<Annotation>'
};

