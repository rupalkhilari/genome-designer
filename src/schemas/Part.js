import fields, { validators } from './fields';
import AnnotationSchema from './Annotation';

/*
A physical sequence.

*/

const PartSchema = {
  id      : types.id().isRequired,
  parent  : types.id(),
  metadata: types.shape({
    authors    : types.arrayOf(types.id()).isRequired,
    version    : types.version().isRequired,
    tags       : types.object().isRequired,
    name       : types.string(),
    description: types.string()
  }).isRequired,

  sequence  : types.id().isRequired,
  source    : types.id(),
  annoations: types.arrayOf(types.shape(AnnotationSchema).isRequired)
};

export default PartSchema;