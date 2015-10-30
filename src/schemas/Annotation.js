import fields from './fields';
import * as validators from './fields/validators';
import InstanceDefinition from './Instance';

/**
 @name AnnotationDefinition
 @parent PartDefinition
 @sbol Annotation (kinda)

 @description
 An annotation on a sequence.
 Should either have a sequence or start+end location

*/

const AnnotationDefinition = InstanceDefinition.extend({

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

  //either a sequence or a range is required, or potentially both? Perhaps dependent on type? Is this just more of an interface?

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