import * as types from './validators';

/*
A sequence, typically of a part and a large string

Sequences are references because they are not usually loaded in the applicaiton, and may be very large, so can be loaded with their own API for defining desired regions

*/

const SequenceSchema = types.shape({
  id      : types.id().isRequired,
  metadata: types.shape({
    authors : types.arrayOf(types.id()).isRequired,
    tags    : types.object().isRequired,
    name    : types.string(),
    description: types.string()
  }).isRequired,

  sequence : types.sequence().isRequired             //todo - define. placeholders? rules?
}).isRequired;

export default SequenceSchema;