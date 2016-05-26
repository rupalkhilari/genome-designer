import fields from './fields/index';
import SchemaDefinition from './SchemaDefinition';
import * as validators from './fields/validators';

const OrderStatusDefinition = new SchemaDefinition({
  foundry: [
    fields.string().isRequired,
    `key of foundry the Order has been submitted to`,
  ],

  remoteId: [
    fields.string().isRequired,
    `ID at remote foundry`,
  ],

  price: [
    fields.number(),
    `Quote for the order`,
  ],
});

export default OrderStatusDefinition;
