import fields from './fields/index';
import SchemaDefinition from './SchemaDefinition';
import OrderParametersDefinition from './OrderParameters';

const OrderDefinition = new SchemaDefinition({
  id: [
    fields.id({ prefix: 'order' }).required,
    'Order UUID',
  ],

  projectId: [
    fields.id({ prefix: 'project' }).required,
    'Associated Project UUID',
    { avoidScaffold: true },
  ],
  projectVersion: [
    fields.version().required,
    'SHA1 version of project when order is made',
    { avoidScaffold: true },
  ],

  parameters: [
    OrderParametersDefinition,
    `Parameters associated with this order`,
  ],

  user: [
    fields.object().required,
    'User information',
  ],

  //todo - update this as needed. Likely needs its own schema
  foundry: [
    fields.object().required,
    'Information about foundry + remote order ID',
  ],

  notes: [
    fields.object().required,
    `Notes about the Order`,
  ],
});

export default OrderDefinition;
