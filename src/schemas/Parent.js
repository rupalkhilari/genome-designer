import fields from './fields/index';
import SchemaDefinition from './SchemaDefinition';

const ParentDefinition = new SchemaDefinition({
  id: [
    fields.id().required,
    'ID of parent instance',
  ],
  projectId: [
    fields.id({prefix: 'project'}),
    'ID of project of parent (if not a project)',
  ],
  version: [
    fields.version(),
    'Version of project, git SHA',
  ],
});

export default ParentDefinition;
