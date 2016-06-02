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
  sequenceAssemblies: [
    fields.bool(),
    'Whether to sequence all assemblies after production',
    { scaffold: () => true },
  ],
  permutations: [
    fields.number(),
    'For multi pot combinatorial this is number of random constructs to assemble',
    { scaffold: () => true },
  ],
  combinatorialMethod: [
    fields.oneOf(['Random Subset', 'Maximum Unique Set', 'All Combinations']),
    'Combinatorial Method',
    { scaffold: () => true},
  ],
};


export class OrderParametersSchemaClass extends Schema {
  constructor(fieldDefinitions) {
    super(Object.assign({}, fieldDefs, fieldDefinitions));
  }
}

export default new OrderParametersSchemaClass();
