import invariant from 'invariant';
import Block from '../../models/Block';

//todo - should only generate on search

export default function parseResults(results) {
  invariant(Array.isArray(results), 'results must be an array');
  return results.map(result => new Block({
    metadata: {
      name: result.name,
    },
    rules: {
      sbol: result.part_type.toLowerCase(),
    },
  }));
}
