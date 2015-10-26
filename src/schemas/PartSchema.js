import * as types from './validators';

/*
A physical sequence.

*/

const PartSchema = types.shape({
  id      : types.id().isRequired,
  parent  : types.id(),
  metadata: types.shape({
    authors : types.arrayOf(types.id()).isRequired,
    tags    : types.object().isRequired,
    name       : types.string(),
    description: types.string()
  }).isRequired,

  sequence: types.id().isRequired,
  source  : types.id(),
  features: types.arrayOf(types.shape({
    optimizability: types.oneOf(),          //todo - define enumeration
    start      : types.number(),
    end        : types.number(),
    description: types.string()
  }))
}).isRequired;

export default PartSchema;