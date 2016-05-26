import fields from './fields/index';
import SchemaDefinition from './SchemaDefinition';
import BlockSourceDefinition from './BlockSource';

const OrderConstructComponentDefinition = new SchemaDefinition({
  componentId: [
    fields.id({ prefix: 'block' }).isRequired,
    `ID of block for this part`,
  ],

  source: [
    BlockSourceDefinition,
    `Source of part`,
  ],
});

export default OrderConstructComponentDefinition;
