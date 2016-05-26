import fields from './fields/index';
import SchemaDefinition from './SchemaDefinition';

const BlockSourceDefinition = new SchemaDefinition({
  source: [
    fields.string().isRequired,
    `key of foundry the Order has been submitted to`,
  ],

  id: [
    fields.string().isRequired,
    `ID at remote foundry`,
  ],
});

export default BlockSourceDefinition;
