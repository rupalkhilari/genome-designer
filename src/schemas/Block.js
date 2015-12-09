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
  'placeholder',
];

//todo - better define structure
const ruleShape = validators.shape({
  type: validators.string(),
  params: validators.object(),
});

const annotationShape = validators.shape({
  //todo - define structure
});

const BlockDefinition = InstanceDefinition.extend({
  /*
   Part-like fields for sequence and sequence annotations, inventory source
   */
  sequence: [
    fields.shape({
      url: validators.string(),
      annotations: validators.array(annotationShape),
    }),
    `Reference to the associated Sequence (not the sequence itself), and list of Annotations associated`,
  ],
  source: [
    fields.shape({
      id: validators.id(),
      existsAsPart: validators.bool(),
    }),
    `Source (Inventory) ID of the Part`,
  ],

  rules: [
    fields.arrayOf(ruleShape).required,
    `Grammar/rules governing the whole Block`,
  ],

  components: [
    fields.arrayOf(validators.id()).required,
    `Array of Blocks of which this Block is comprised`,
  ],

  options: [
    fields.arrayOf(validators.id()).required,
    `Array of Blocks that form the List Block`,
  ],

  notes: [
    fields.object().required,
    `Notes about the whole Block`,
  ],

  /*
   //Avoiding this until good reason to include it
   template: [
   fields.id(),
   `Reference to another Block to use as a template (i.e. validation, component rules)`,
   ],
   */
});

export default BlockDefinition;
