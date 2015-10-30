import fields from './fields';
import * as validators from './fields/validators';
import InstanceDefinition from './Instance';

/**
 @name BlockDefinition
 @description A component of a construct, or construct itself
 @sbol Component

 */

//SBOL has a field called role, particularly in defining modules. We may want to add this later. For now, this annotation can be a role per-component.
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
  template: [
    fields.id(),
    `Reference to another Block to use as a template (i.e. validation, component rules)`
  ],
  // placeholder for block-level validation.
  // todo - define structure
  rules     : [
    fields.shape({
      type  : validators.string(),
      params: validators.object()
    }).required,
    `Grammar/rules governing the whole Block`
  ],
  //todo - define structure. May want to make own Definition.
  components: [
    fields.arrayOf(validators.shape({
      rules: validators.object(),
      options: validators.arrayOf(validators.id())
    })).required,
    `Array of Blocks/Parts (and their rules) of which this Block is comprised`
  ]
});

export default BlockDefinition;