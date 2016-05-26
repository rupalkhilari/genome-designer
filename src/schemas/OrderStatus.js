import fields from './fields/index';
import SchemaDefinition from './SchemaDefinition';
import * as validators from './fields/validators';

const OrderStatusDefinition = new SchemaDefinition({
  foundry: [
    fields.shape({
      id: validators.string(),
    }).isRequired,
    `key of foundry the Order has been submitted to`,
  ],

  remoteId: [
    fields.string(),
    `ID at remote foundry`,
  ],

  price: [
    fields.number(),
    `Quote for the order`,
  ],
});

export default OrderStatusDefinition;
