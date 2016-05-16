import fields from './fields/index';
import SchemaDefinition from './SchemaDefinition';

const RulesDefinition = new SchemaDefinition({
  role: [
    fields.string(),
    'Role of the Block (often corresponds to SBOL symbols)',
  ],
  hidden: [
    fields.bool(),
    'The block is hidden in the design canvas. It serves as template logic.',
  ],
  isList: [
    fields.bool(),
    'Dictionary of tags defining object',
  ],
  frozen: [
    fields.bool(),
    'The block is immutable - no changes are allowed',
  ],
  fixed: [
    fields.bool(),
    'Block Ids of components are fixed - no movement, insertions, deletions, substitutions',
  ],
  filter: [
    fields.object(),
    'Map of fields to allowed values for constituents (options / components)',
  ],
});

export default RulesDefinition;
