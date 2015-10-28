import fields, { validators } from './fields';

/*
@description A sequence, typically of a part and a large string. Sequences are references because they are not usually loaded in the applicaiton, and may be very large, so can be loaded with their own API for defining desired regions
@sbol Sequence (mostly)

*/

export const enumType = [
  'dna',        //IUPAC DNA
  'protein', 		//IUPAC Protein
  'molecule' 		//SMILES
];

const SequenceSchema = {
  id      : validators.id().isRequired,
  metadata: validators.shape({
    authors    : validators.arrayOf(validators.id()).isRequired,
    version    : validators.version().isRequired,
    tags       : validators.object().isRequired,
    name       : validators.string(),
    description: validators.string()
  }).isRequired,

  type: validators.oneOf(enumType).isRequired,

  sequence     : validators.sequence().isRequired,    //todo - define. placeholders? rules? how to pass type?
  orientForward: validators.bool()                    //default is forward
};

export default SequenceSchema;