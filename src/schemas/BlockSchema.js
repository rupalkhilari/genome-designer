import * as types from './validators';

/*
A component of a construct, or construct itself

*/

const BlockSchema = types.shape({
  id      : types.id().isRequired,
  parent  : types.id(),
  metadata: types.shape({
    authors : types.arrayOf(types.id()).isRequired,
    tags    : types.object().isRequired,
    name    : types.string(),
    description: types.string()
  }).isRequired,

  components : types.arrayOf().isRequired             //todo - define structure / relation to template?
}).isRequired;

export default BlockSchema;