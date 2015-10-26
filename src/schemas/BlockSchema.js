import * as types from './validators';

/*
@description A component of a construct, or construct itself
@sbol Component

*/

const BlockSchema = types.shape({
  id      : types.id().isRequired,
  parent  : types.id(),
  metadata: types.shape({
    authors : types.arrayOf(types.id()).isRequired,
    version: types.version().isRequired,
    tags    : types.object().isRequired,
    name    : types.string(),
    description: types.string()
  }).isRequired,

  roles: types.arrayOf(types.oneOf([
	'Promoter',		//todo - complete enumeration. These are from SBOL. consider visual symbols
	'RBS',
	'CDS',
	'Terminator',
	'Gene',
	'Engineered Gene',
	'mRNA'
  ]))

  components : types.arrayOf().isRequired             //todo - define structure / relation to template?
}).isRequired;

export default BlockSchema;