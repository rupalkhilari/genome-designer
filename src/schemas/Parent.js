import fields from './fields/index';
import SchemaDefinition from './SchemaDefinition';

const ParentDefinition = new SchemaDefinition({
  id: [
    fields.id().required,
    'ID of parent instance',
  ],
  sha: [
    fields.version().required,
    'Version of project, git SHA',
  ],
});

export default ParentDefinition;
