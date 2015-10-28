import fields, {schemaField} from './fields';

/*
@description An annotation on a sequence.
@parent Part
@sbol Annotation (kinda)

*/

const AnnotationSchema = {
  metadata: validators.shape({
    version    : validators.version().isRequired,
    authors    : validators.arrayOf(validators.id()).isRequired,
    tags       : validators.object().isRequired,
    name       : validators.string(),
    description: validators.string()
  }).isRequired,

  optimizability: validators.oneOf([ //todo - rename
    'none', //todo - define enum. allow sequence? capture as sequence e.g. ACNRYGT
    'codon-optimize',
    'any'
  ]),

  //either a sequence or a range is required, or potentially both? Perhaps dependent on type? Is this just more of an interface?

  sequence: validators.sequence(),
  start   : validators.number(),
  end     : validators.number()
};

export default AnnotationSchema;