import * as types from './validators';

/*
@description An annotation on a sequence.
@parent Part
@sbol Annotation (kinda)

*/

const AnnotationSchema = types.shape({
  metadata: types.shape({
    version: types.version().isRequired,
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

export default AnnotationSchema;