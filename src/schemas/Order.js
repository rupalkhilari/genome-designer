import fields from './fields/index';
import * as validators from './fields/validators';
import Schema from './SchemaClass';
import MetadataSchema from './Metadata';
import OrderParametersSchema from './OrderParameters';
import OrderStatusSchema from './OrderStatus';

const orderFields = {
  id: [
    fields.id({ prefix: 'order' }).required,
    'Order UUID',
  ],

  metadata: [
    MetadataSchema,
    'Metadata for the order',
  ],

  projectId: [
    fields.id({ prefix: 'project' }).required,
    'Associated Project UUID',
    { avoidScaffold: true },
  ],

  projectVersion: [
    fields.version().required,
    'SHA1 version of project when order is submitted',
    { avoidScaffold: true },
  ],

  constructIds: [
    fields.arrayOf(validators.id()).required,
    `IDs of constructs in project involved in order`,
  ],

  numberCombinations: [
    fields.number(validators.id()).required,
    `Number of possible combinations, determined when making the order`,
  ],

  parameters: [
    OrderParametersSchema,
    `Parameters associated with this order`,
  ],

  user: [
    fields.string().required,
    'User ID',
    { avoidScaffold: true },
  ],

  status: [
    OrderStatusSchema,
    'Information about foundry + remote order ID',
  ],

  notes: [
    fields.object().required,
    `Notes about the Order`,
  ],
};

export class OrderSchemaClass extends Schema {
  constructor(fieldDefinitions) {
    super(Object.assign({}, orderFields, fieldDefinitions));
  }
}

export default new OrderSchemaClass();
