import fields from './fields';
import * as validators from './fields/validators';
import SchemaDefinition from './SchemaDefinition';

/**
 @name AnnotationDefinition
 @parent PartDefinition
 @sbol Annotation (kinda)

 @description
 An annotation on a sequence.
 Should either have a sequence or start+end location

 */

const AnnotationDefinition = new SchemaDefinition({

  description: [
    fields.string(),
    'Description of annotation'
  ],
  tags       : [
    fields.object().required,
    'Dictionary of tags defining annotation'
  ],
  //todo - decide if we need this
  //todo - rename
  //todo - define enum. allow degenerate sequence specification?
  optimizability: [
    fields.oneOf([
      'none',
      'codon',
      'any'
    ]),
    'Degree to which annotation can be safely changed, e.g. codon-optimized'
  ],
  sequence: [
    fields.sequence(),
    'IUPAC sequence of the annotation'
  ],
  start   : [
    fields.number({min: 0}),
    'Location of start of annoation'
  ],
  end     : [
    fields.number({min: 0}),
    'Location of end of annotation'
  ]
});

export default AnnotationDefinition;