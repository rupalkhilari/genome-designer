import invariant from 'invariant';
import connectors from './connectors';
import parts from './parts';
import Block from '../../models/Block';
import { merge } from 'lodash';

const blocksCreated = [];

// number
const getOptionParts = (pos, optionId) => {
  return parts.filter(part => part.metadata.egfPosition === `${pos}`)
    .reduce((acc, part, index) => Object.assign(acc, { [part.id]: (optionId ? optionId === part.id : index === 0) }), {});
};

// string
// string with numbers for positions
// letters for name ('A-C')
const getConnector = (term) => {
  const isPos = !isNaN(parseInt(term[0], 10));
  return connectors.find(conn => isPos ?
    conn.metadata.egfPosition === `${term}` :
    conn.metadata.name === `conn ${term.toUpperCase()}`
  );
};

// create list block with parts
const list = (pos, optionId) => { //eslint-disable-line id-length
  const listBlock = new Block({
    metadata: {
      name: `Position ${pos}`,
    },
    rules: {
      list: true,
    },
    options: getOptionParts(pos),
    notes: {
      Position: pos,
    },
  });

  blocksCreated.push(listBlock);
  return listBlock;
};

// create block which is connector
const conn = (term) => { //eslint-disable-line id-length
  const merged = merge({},
    getConnector(term),
    {
      metadata: {
        color: '#bababa',
      },
      rules: {
        frozen: true,
        hidden: true,
      },
    },
  );
  delete merged.id;
  const connector = new Block(merged);

  blocksCreated.push(connector);
  return connector;
};

const stringIsConnector = (string) => (/^[a-zA-Z](-[a-zA-Z])?$/gi).test(string);

//pass strings for connectors, and numbers for parts
//todo - need to handle linkers
const makeComponents = (terms) => {
  return terms
    .map(term => Number.isInteger(term) ? list(term) : conn(term)) //eslint-disable-line no-nested-ternary
    .map(block => block.id);
};

const templateFromComponents = (components, toMerge = {}) => {
  return new Block(merge({},
    toMerge,
    {
      components: makeComponents(components),
      rules: {
        fixed: true,
      },
    },
  ));
};

//todo - may not want to add to the same list of created blocks - maybe put examples + new component list blocks into a new array
//need to find the specific one for this position, not just by name, because dependent on position
const exampleOfTemplate = (template, options, toMerge = {}) => {
  let optionSpecifiedIndex = 0;
  const components = template.components
    .map(componentId => blocksCreated.find(block => block.id === componentId))
    .map(component => {
      if (!component.isList()) {
        return component.id;
      }

      const pos = component.notes.Position;
      const desiredOption = options[optionSpecifiedIndex];
      const optionBlocks = Object.keys(component.options).map(optionId => parts.find(block => block.id === optionId));
      const option = optionBlocks.find(option => {
        const { name, shortName } = option.metadata;
        return name.toLowerCase() === desiredOption.toLowerCase() ||
          (shortName && shortName.toLowerCase() === desiredOption.toLowerCase());
      });
      invariant(option, `must have an option!
      ${template.metadata.name}, position ${pos}
      wanted ${desiredOption} (index ${optionSpecifiedIndex} of [${options.join(', ')}])
      possibilities are ${optionBlocks.map(block => `${block.metadata.name} [${block.metadata.shortName}]`).join(', ')}
      `);
      const optionId = option.id;

      //create a new block, and add it to the list of blocks created
      const newListComponent = list(pos, optionId);
      optionSpecifiedIndex++;

      return newListComponent.id;
    });

  return template.merge(merge(toMerge, {
    components,
    rules: {
      frozen: true,
      fixed: false,
    },
  }));
};

const template1 = templateFromComponents(
  ['a-c', 3, 'd-f', 6, 7, 'h-k', 11, 'l-y', 25],
  {
    metadata: {
      name: 'Template 1',
      description: 'Episomal vector with one transcription unit for expression of a tagged protein',
    },
    notes: {
      Name: 'Plasma membrane targeting vector',
      Category: 'Stable transfection',
      Subcategory: 'Episomal vector',
      'Number of Transcription Units': 'One',
      'Transcription Unit Structure': 'Monocistronic',
      'Coding sequence design': 'Tagged protein',
      'Selection Marker': 'Absent',
    },
  },
);

const example1 = exampleOfTemplate(
  template1,
  ['CAGp', 'Pal', 'mNG', 'SV40pA', 'SV40-ORI'],
  {
    metadata: {
      name: 'Plasma membrane targeting vector',
      decription: `This vector is design for targeting of a protein (in this case mNG) to plasma membrane. Palmitoylation sequence added upstream of mNG target the protein to the plasma membrane.
Addition of SV40-ORI makes this vector episomal when is introduced in HEK293T cells expressing the SV40 Large T-antigen.`,
    },
    notes: {
      Application: 'Targeting of proteins to cellular compartments',
    },
  },
);

const template9 = templateFromComponents(
  [1, 2, 3, 'd-e', 5, 6, 7, 8, 9, 'h-k', 11, 'l-w', 23, 24, 'y-z'],
  {
    metadata: {
      name: 'Template 9',
      description: 'Vector for genomic integration of a landing pad'
    },
    notes: {
      //todo
    },
  },
);

/* has attP in illegal position. is this a real part? ask andrea
 const example9 = exampleOfTemplate(
 template9,
 ["5'HA-hAAVS1", 'IS_FB', 'CAGp', 'attP', 'BxB1', 'p2A', 'PuroR', 'SV40A', 'IS_FB', "3'HA-hAAVS1"]
 );
 */

export const examples = [example1, example9];
export const templates = [template1, template9];

export const allBlocks = [...connectors, ...parts, ...blocksCreated, ...templates];

//todo - clarify exporting of all blocks. Probably should put examples in their own project?
