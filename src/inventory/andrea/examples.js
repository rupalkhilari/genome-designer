//examples of templates
//requires templates to have already been made

import invariant from 'invariant';
import { merge } from 'lodash';
import { list } from './templateUtils';
import { templates, blocks as templateBlocks } from './templates';

//list of list blocks created while creating our examples
const created = [];

const getTemplate = (name) => templates.find(tmpl => tmpl.metadata.name.toLowerCase() === `template ${name}`);

//need to find the specific one for this position, not just by name, because dependent on position
const exampleOfTemplate = (template, options, toMerge = {}) => {
  let optionSpecifiedIndex = 0;
  const components = template.components
    .map(componentId => templateBlocks.find(block => block.id === componentId))
    .map(component => {
      if (!component.isList()) {
        return component.id;
      }

      const pos = component.notes.Position;
      const desiredOption = options[optionSpecifiedIndex];
      const optionBlocks = Object.keys(component.options).map(optionId => templateBlocks.find(block => block.id === optionId));
      const option = optionBlocks.find(option => {
        const { name, shortName } = option.metadata;
        return name.toLowerCase() === desiredOption.toLowerCase() ||
          (shortName && shortName.toLowerCase() === desiredOption.toLowerCase());
      });

      invariant(pos, 'must have a position this refers to');
      invariant(option, `must have an option!
      ${template.metadata.name}, position ${pos}
      wanted ${desiredOption} (index ${optionSpecifiedIndex} of [${options.join(', ')}])
      possibilities are ${optionBlocks.map(block => `${block.metadata.name} [${block.metadata.shortName}]`).join(', ')}
      `);

      const optionId = option.id;

      //create a new block, and add it to the list of blocks created
      const newListComponent = list(pos, optionId);
      created.push(newListComponent);
      optionSpecifiedIndex++;

      return newListComponent.id;
    });

  return template.merge(merge(toMerge, {
    components,
    rules: {
      frozen: true,
    },
  }));
};

export const examples = [
  exampleOfTemplate(
    getTemplate('1A'),
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
  ),

  exampleOfTemplate(
    getTemplate('1B'),
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
  ),
];

export const blocks = [... new Set(created)];
