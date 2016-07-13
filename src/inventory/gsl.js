import GslOperatorSchema from '../schemas/GslOperator';

export const colors = {
  blue: '#3F82FF',
  red: '#CC8888',
};

export const operators = [
  {
    id: 'locus',
    name: 'Gene Locus',
    type: 'Level 1 Prefix',
    description: `Type the g operator as a prefix to a gene name to specify that gene by name`,
    examples: [
      'gHMG1',
      'gERG10[-100:50]',
    ],
    color: colors.blue,
  },
  {
    id: 'promoter',
    name: 'Promoter Part',
    type: 'Level 1 Prefix',
    description: `Type the p operator as a prefix to a gene name to specify that gene's promoter`,
    examples: [
      'pEFGR',
    ],
    color: colors.red,
  },
];

export function gslImage(gslId) {
  return `images/gsl/${gslId}.svg`;
}

export const operatorIds = operators.map(operator => operator.id);
