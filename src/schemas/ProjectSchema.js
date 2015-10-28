import fields, { validators } from './fields';

/*
Project is the container for a body of work.

*/

const ProjectSchema = {
  id      : validators.id().isRequired,
  parent  : validators.id(),
  metadata: validators.shape({
    authors    : validators.arrayOf(validators.id()).isRequired,
    version    : validators.version().isRequired,
    tags       : validators.object().isRequired,
    name       : validators.string(),
    description: validators.string()
  }).isRequired,

  components: validators.arrayOf(validators.id()).isRequired
};

export default ProjectSchema;