import invariant from 'invariant';
import Block from '../../models/Block';

export default function parseResults(results) {
  invariant(Array.isArray(results), 'results must be an array');

  //testing - limit to 100 results
  const length = results.length > 100 ? 100 : results.length;

  return results.slice(0, length).map(result => {
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
        id: 'egf'
      }
    });
  });
}
