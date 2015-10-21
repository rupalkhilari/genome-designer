import * as types from './validators';

const PartSchema = types.shape({
  id      : types.id.isRequired,
  parent  : types.id,
  metadata: types.shape({
    name       : types.string,
    description: types.string
  }).isRequired,
  authors : types.arrayOf(types.id).isRequired,
  source  : types.id,
  sequence: types.id,
  tags    : types.object,
  features: types.arrayOf(types.shape({
    start      : types.number,
    end        : types.number,
    description: types.string
  }))
}).isRequired;

export default PartSchema;