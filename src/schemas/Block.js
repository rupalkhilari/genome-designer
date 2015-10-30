import fields from './fields';
import * as validators from './fields/validators';
import InstanceDefinition from './Instance';

/**
 @name BlockDefinition
 @description A component of a construct, or construct itself
 @sbol Component

 */

//todo - complete enumeration. consider other visual symbols (e.g. templating)
export const enumRoles = [
  //SBOL
  'Promoter',
  'RBS',
  'CDS',
  'Terminator',
  'Gene',
  'Engineered Gene',
  'mRNA',

  //others
  'placeholder'
];

const BlockDefinition = InstanceDefinition.extend({
  role      : [
    fields.oneOf(enumRoles),
    `A specific role of this block, useful e.g. for inventory filtering`
  ],
  // placeholder for block-level validation.
  // todo - define structure
  rules     : [
    fields.shape({
      type  : validators.string(),
      params: validators.object()
    }),
    `Grammar/rules governing the whole Block`
  ],
  components: [
    fields.arrayOf().required,
    `Array of Blocks/Parts of which this Block is comprised`
  ]
});

export default BlockDefinition;