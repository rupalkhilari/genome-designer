import * as types from './validators';

/*
Container defining placeholders, rules etc. within a block

*/

const TemplateSchema = types.shape({
  id      : types.id().isRequired,
  parent  : types.id(),
  metadata: types.shape({
    name    : types.string(),
    authors : types.arrayOf(types.id).isRequired,
    tags    : types.object().isRequired,
    description: types.string()
  }).isRequired,

  grammar : types.object().isRequired             //todo - define. placeholders? rules?
}).isRequired;

export default TemplateSchema;