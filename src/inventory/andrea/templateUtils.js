import invariant from 'invariant';
import connectors from './connectors';
import parts from './parts';
import Block from '../../models/Block';
import { merge } from 'lodash';

const termIsPartPos = term => Number.isInteger(term) || term === '8a' || term === '8b';
const stringIsConnector = (string) => (/^[a-zA-Z](-[a-zA-Z])?( BsaI\-.)?$/gi).test(string);

// pass number, return map for block options
export const getOptionParts = (pos, optionId) => {
  return parts.filter(part => part.metadata.egfPosition === `${pos}`)
    .reduce((acc, part, index) => Object.assign(acc, { [part.id]: (optionId ? optionId === part.id : index === 0) }), {});
};

// create list block with parts
export const list = (pos, optionId) => { //eslint-disable-line id-length
  const listBlock = new Block({
    metadata: {
      name: `Position ${pos}`,
    },
    rules: {
      list: true,
    },
    options: getOptionParts(pos, optionId),
    notes: {
      Position: pos,
    },
  });

  return listBlock;
};

// create block which is connector
// string with numbers for positions
// letters for name ('A-C')
export const conn = (term) => { //eslint-disable-line id-length
  const isPos = !isNaN(parseInt(term[0], 10));
  return connectors.find(conn => isPos ?
    conn.metadata.egfPosition === `${term}` :
    conn.metadata.name.toUpperCase() === `conn ${term}`.toUpperCase()
  );
};

//specific part by name or shortname
//frozen, can clone it yourself if you want to
export const part = (term) => {
  return parts.find(part => {
    return part.metadata.name.toLowerCase() === term ||
      part.metadata.shortName.toLowerCase() === term;
  });
};

//pass numbers for parts, strings as '#' or '#-#' for connectors (or e.g. 'A-B BsaI-X', see regex above), otherwise a part name
//todo - need to handle linkers
export const makeComponents = (...terms) => {
  return terms
    .map(term => termIsPartPos(term) ? //eslint-disable-line no-nested-ternary
      list(term) :
      stringIsConnector(term) ?
        conn(term) :
        part(term));
};

//pass in actual list of compoennts
export const templateFromComponents = (components, toMerge = {}) => {
  invariant(components.every(comp => Block.validate(comp)), 'must pass valid blocks');

  return new Block(merge({},
    toMerge,
    {
      components: components.map(comp => comp.id),
      rules: {
        fixed: true,
      },
    },
  ));
};
