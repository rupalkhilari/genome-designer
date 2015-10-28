import fields, { validators } from './fields';

/*
@description A component of a construct, or construct itself
@sbol Component

*/

//todo - complete enumeration. These are from SBOL. consider other visual symbols (e.g. templating)
export const enumRoles = [
  'Promoter',
  'RBS',
  'CDS',
  'Terminator',
  'Gene',
  'Engineered Gene',
  'mRNA'
];

const BlockSchema = {
  id      : validators.id().isRequired,
  parent  : validators.id(),
  metadata: validators.shape({
    authors    : validators.arrayOf(validators.id()).isRequired,
    version    : validators.version().isRequired,
    tags       : validators.object().isRequired,
    name       : validators.string(),
    description: validators.string()
  }).isRequired,

  roles: validators.arrayOf(validators.oneOf(enumRoles)),

  components: validators.arrayOf().isRequired             //todo - define structure / relation to template?
};

export default BlockSchema;