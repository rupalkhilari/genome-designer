import fields from './fields/index';
import SchemaDefinition from './SchemaDefinition';
import OrderConstructComponentDefinition from './OrderConstructComponent';

const OrderConstructDefinition = new SchemaDefinition({
  id: [
    fields.id({prefix: 'oc'}).isRequired,
    'ID of order construct',
  ],

  components: [
    fields.arrayOf(OrderConstructComponentDefinition.validate.bind(OrderConstructComponentDefinition)).isRequired,
    'Array of array of all the components, with information about block and source ID',
  ],

  active: [
    fields.bool(),
    'Construct is selected and will be ordered',
    { scaffold: () => true },
  ],
});

export default OrderConstructDefinition;
