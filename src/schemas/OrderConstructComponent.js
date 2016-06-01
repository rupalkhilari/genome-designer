import fields from './fields/index';
import Schema from './SchemaClass';
import BlockSourceDefinition from './BlockSource';

const OrderConstructComponentDefinition = new Schema({
  componentId: [
    fields.id({ prefix: 'block' }).required,
    `ID of block for this component`,
  ],

  source: [
    BlockSourceDefinition,
    `Source of component`,
  ],
});

export default OrderConstructComponentDefinition;
