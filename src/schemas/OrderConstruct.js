import fields from './fields/index';
import * as validators from './fields/validators';
import Schema from './SchemaClass';

const fieldDefs = {
  componentIds: [
    fields.arrayOf(validators.id()).required,
    'Array of componentIds. Fetch blocks from the project rollup',
  ],

  active: [
    fields.bool(),
    'Construct is selected and will be ordered',
    { scaffold: () => true },
  ],
};

export class OrderConstructSchemaClass extends Schema {
  constructor(fieldDefinitions) {
    super(Object.assign({}, fieldDefs, fieldDefinitions));
  }
}

export default new OrderConstructSchemaClass();
