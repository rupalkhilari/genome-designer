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
    fields.number(),
    `Quote for the order`,
  ],
};

export class OrderStatusSchemaClass extends Schema {
  constructor(fieldDefinitions) {
    super(Object.assign({}, fieldDefs, fieldDefinitions));
  }
}

export default new OrderStatusSchemaClass();

