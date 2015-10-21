import * as types from './validators';
import { PropTypes } from 'react';

// note that React apparently intends to move to Flow for type checking, and deprecate PropTypes.
// They do not plan to roll out as own tool, or to expose helper functions
// (e.g. so isRequired chaining needs to be custom to align our own validators with theirs)

const PartSchema = PropTypes.shape({
  id: types.id,
  parent : PropTypes.oneOfType([
    types.id,
    PropTypes.instanceOf(null)
  ]).isRequired,
  metadata: PropTypes.shape({
    name : PropTypes.string,
    description: PropTypes.string
  }).isRequired,
  authors : PropTypes.arrayOf(types.id).isRequired,
  source: types.id,                                     //todo - needs to be optional
  sequence: types.id,                                   //todo - needs to be optional
  tags: PropTypes.object,
  features: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
    description: PropTypes.string
  }))
}).isRequired;

export default PartSchema;