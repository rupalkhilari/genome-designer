import fields from './fields';
import * as validators from './fields/validators';
import SchemaDefinition from './SchemaDefinition';

const MetadataDefinition = new SchemaDefinition({
  name       : [
    fields.string(),
    'Name of the instance'
  ],
  description: [
    fields.string(),
    'Description of instance'
  ],
  authors    : [
    fields.arrayOf(validators.id(), {required : true}).required,
    'IDs of authors'
  ],
  version    : [
    fields.version().required,
    'Semantic version of Instance'
  ],
  tags       : [
    fields.object().required,
    'Dictionary of tags defining object'
  ]
});

const InstanceDefinition = new SchemaDefinition({
  id: [
    fields.id().required,
    'ID of the instance'
  ],

  parent: [
    fields.id(),
    'Ancestral parent from which object is derived'
  ],

  metadata: [
    MetadataDefinition,
    'Metadata for the object'
  ]
});

//todo - should use a class instead of just object assign
const InstanceBase = (childDefinition = {}) => {
  return Object.assign({}, childDefinition, InstanceDefinition);
};

console.log(InstanceDefinition);

export default InstanceBase;