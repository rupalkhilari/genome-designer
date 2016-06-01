import fields from './fields/index';
import Schema from './SchemaClass';

import ParentDefinition from './Parent';
import MetadataDefinition from './Metadata';

const instanceFields = {
  id: [
    fields.id().required,
    'ID of the instance',
  ],
  parents: [
    fields.arrayOf(ParentDefinition.validate.bind(ParentDefinition)).required,
    'Ancestral parents from which object is derived, with newest first',
  ],
  metadata: [
    MetadataDefinition,
    'Metadata for the object',
  ],
};

export class InstanceSchemaClass extends Schema {
  constructor(fieldDefinitions) {
    super(Object.assign({}, instanceFields, fieldDefinitions));
  }
}

export default new InstanceSchemaClass();
