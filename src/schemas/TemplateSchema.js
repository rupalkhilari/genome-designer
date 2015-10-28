import fields, { validators } from './fields';

/*
@description Container defining placeholders, rules etc. within a block
@sbol ComponentDefinition

*/

const TemplateSchema = {
  id      : validators.id().isRequired,
  parent  : validators.id(),
  metadata: validators.shape({
    name       : validators.string(),
    authors    : validators.arrayOf(validators.id).isRequired,
    version    : validators.version().isRequired,
    tags       : validators.object().isRequired,
    description: validators.string()
  }).isRequired,

  grammar: validators.object().isRequired             //todo - define. placeholders? rules?
};

export default TemplateSchema;