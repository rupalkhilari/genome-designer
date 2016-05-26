import fields from './fields/index';
import SchemaDefinition from './SchemaDefinition';

import ParentDefinition from './Parent';
import MetadataDefinition from './Metadata';

const InstanceDefinition = new SchemaDefinition({
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
});

export default InstanceDefinition;
