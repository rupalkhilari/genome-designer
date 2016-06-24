import fields from './fields/index';
import Schema from './SchemaClass';

const fieldDefs = {
  method: [
    fields.string(),
    `Assembly method to be used`,
  ],
  onePot: [
    fields.bool().required,
    'Reaction is combinatorial and all parts will be combined in one tube, resulting in many combinatorial assemblies mixed together.',
    { scaffold: () => true },
  ],
  sequenceAssemblies: [
    fields.bool(),
    'Whether to sequence all assemblies after production',
    { scaffold: () => false },
  ],
  permutations: [
    fields.number(),
    'For multi pot combinatorial this is number of random constructs to assemble',
  ],
  combinatorialMethod: [
    fields.oneOf(['Random Subset', 'Maximum Unique Set']),
    'Combinatorial Method',
  ],
  activeIndices: [
    fields.object(),
    'If # permutations desired is less than number combinations possible, indices of constructs to keep',
  ],
};

export class OrderParametersSchemaClass extends Schema {
  constructor(fieldDefinitions) {
    super(Object.assign({}, fieldDefs, fieldDefinitions));
  }

  validate(instance, shouldThrow) {
    const fieldsValid = super.validateFields(instance, shouldThrow);

    if (!fieldsValid) {
      return false;
    }

    const hasFieldsIfNotOnePot = instance.onePot || (instance.combinatorialMethod && instance.permutations && instance.activeIndices); //todo - should make sure number active instances is correct

    if (!hasFieldsIfNotOnePot) {
      const errorMessage = 'Combinatorial method and # permutations required if not one pot, and activeInstances must be present and its length match # permutations';
      if (shouldThrow) {
        throw Error(errorMessage, instance);
      } else if (process.env.NODE_ENV !== 'production') {
        console.error(errorMessage); //eslint-disable-line
      }
    }

    return fieldsValid && hasFieldsIfNotOnePot;
  }
}

export default new OrderParametersSchemaClass();
