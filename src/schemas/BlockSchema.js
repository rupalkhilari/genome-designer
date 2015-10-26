import * as types from './validators';
import PartSchema from './PartSchema'
/*
A component of a construct, or construct itself

todo - determine relation between Blocks and Templates, and how components are tied to the template

*/

const BlockSchema = types.shape({
  id      : types.id().isRequired,
  parent  : types.id(),
  metadata: types.shape({
    authors : types.arrayOf(types.id()).isRequired,
    tags    : types.object().isRequired,
    name    : types.string(),
    description: types.string()
  }).isRequired,

  template: types.id(),			//todo - is this required? How to handle multple?

  components : types.arrayOf(types.oneOfType([
	PartSchema,
	BlockSchema  				//todo - verify self-reference works here
  ])).isRequired
}).isRequired;

export default BlockSchema;