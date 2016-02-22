import fields from './fields/index';
import SchemaDefinition from './SchemaDefinition';

const ParentDefinition = new SchemaDefinition({
  project: [
    fields.id().required,
    'Name of the instance',
  ],
  block: [
    fields.id().required,
    'Description of instance',
  ],
  sha: [
    fields.version().required,
    'Version of project, git SHA',
  ],
});

export default ParentDefinition;
