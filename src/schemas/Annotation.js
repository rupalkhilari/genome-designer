import fields from './fields';
import * as validators from './fields/validators';
import InstanceDefinition from './Instance';

/*
@description An annotation on a sequence.
@parent Part
@sbol Annotation (kinda)

@description
Should either have a sequence or start+end location

*/

const AnnotationDefinition = InstanceDefinition.extend({

  //todo - rename
  //todo - define enum. allow sequence? capture as sequence e.g. ACNRYGT
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