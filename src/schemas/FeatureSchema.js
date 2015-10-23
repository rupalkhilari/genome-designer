import * as types from './validators';

/*
An annotation on a sequence.
Child of Part.

*/

const FeatureSchema = types.shape({
  metadata: types.shape({
    authors : types.arrayOf(types.id()).isRequired,
    tags    : types.object().isRequired,
    name    : types.string(),
    description: types.string()
  }).isRequired,

  optimizability: types.oneOf(['none', 'codon-optimize', 'any']), //todo - define enum. allow sequence? capture as sequence e.g. ACNRYGT
  sequence   : types.sequence(),
  start      : types.number(),
  end        : types.number(),

}).isRequired;

export default FeatureSchema;