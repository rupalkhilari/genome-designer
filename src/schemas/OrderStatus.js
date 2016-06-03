import fields from './fields/index';
import Schema from './SchemaClass';

const fieldDefs = {
  foundry: [
    fields.string().required,
    `key of foundry the Order has been submitted to`,
  ],

  remoteId: [
    fields.string().required,
    `ID at remote foundry`,
  ],

  price: [
    fields.any(),
    `Quote for the order`,
  ],

  timeSent: [
    fields.string(),
    `Time when the order was sent`,
  ],
};

export class OrderStatusSchemaClass extends Schema {
  constructor(fieldDefinitions) {
    super(Object.assign({}, fieldDefs, fieldDefinitions));
  }
}

export default new OrderStatusSchemaClass();

