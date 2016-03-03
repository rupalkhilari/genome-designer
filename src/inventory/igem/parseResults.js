import invariant from 'invariant';
import Block from '../../models/Block';

export function parseResult(result) {
  const { name, part_type } = result;
  let partType = part_type.toLowerCase();
  if (partType === 'orf') {
    partType = 'cds';
  }

  return new Block({
    metadata: {
      name: name,
    },
    rules: {
      sbol: partType,
    },
    source: {
      source: 'igem',
      id: name,
    },
  });
}

export default function parseResults(results) {
  invariant(Array.isArray(results), 'results must be an array');

  return results.map(parseResult);
}
