import fields from './fields';
import SchemaDefinition from './helpers';

const MetadataDefinition = {
  version    : fields.version().required,
  authors    : fields.arrayOf(fields.id().required).required,
  tags       : fields.object().required,
  name       : fields.string(),
  description: fields.string()
};

const InstanceDefinition = new SchemaDefinition({
  id      : [
    fields.id().required,
    'ID of the instance'
  ],

  parent  : [
    fields.id(),
    'Ancestral parent from which object is derived'
  ]

  //todo - need better handle for childen + inheritance. use classes!

  /*
  metadata: schemaField(
    MetadataDefinition,
    'Metadata for the object')
  */
});

//todo - should use a class instead of just object assign
const InstanceBase = (childDefinition = {}) => {
  return Object.assign({}, childDefinition, InstanceDefinition);
};

console.log(InstanceDefinition);

export default InstanceBase;