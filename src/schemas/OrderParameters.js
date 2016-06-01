import fields from './fields/index';
import Schema from './SchemaClass';

const OrderParametersDefinition = new Schema({
  method: [
    fields.string(),
    `Assembly method to be used`,
  ],

  onePot: [
    fields.bool(),
    'Reaction is combinatorial and all parts will be combined in one tube, resulting in many combinatorial assemblies mixed together.',
    { scaffold: () => true },
  ],
});

export default OrderParametersDefinition;
