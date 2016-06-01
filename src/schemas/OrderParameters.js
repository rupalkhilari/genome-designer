import fields from './fields/index';
import Schema from './SchemaClass';

const fieldDefs = {
  method: [
    fields.string(),
    `Assembly method to be used`,
  ],

  onePot: [
    fields.bool(),
    'Reaction is combinatorial and all parts will be combined in one tube, resulting in many combinatorial assemblies mixed together.',
    { scaffold: () => true },
  ],
};

export class OrderParametersSchemaClass extends Schema {
  constructor(fieldDefinitions) {
    super(Object.assign({}, fieldDefs, fieldDefinitions));
  }
}

export default new OrderParametersSchemaClass();
