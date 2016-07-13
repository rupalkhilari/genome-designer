import GslOperatorSchema from '../schemas/GslOperator';

export const colors = {
  blue: '#3F82FF',
  red: '#EE4444',
};

export const operators = [
  {
    id: 'geneLocus',
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
  {
    id: 'terminator',
    name: 'Terminator Part',
    type: 'Level 1 Prefix',
    description: `Type the t operator as a prefix to a gene name to specify that gene's terminator`,
    examples: [
      'tErg10',
    ],
    color: colors.red,
  },
  {
    id: 'upstream',
    name: 'Upstream Part',
    type: 'Level 1 Prefix',
    description: ``,
    examples: [],
    color: colors.red,
  },
  {
    id: 'downstream',
    name: 'Downstream Part',
    type: 'Level 1 Prefix',
    description: ``,
    examples: [],
    color: colors.red,
  },
  {
    id: 'orf',
    name: 'Open Reading Frame (ORF)',
    type: 'Level 1 Prefix',
    description: ``,
    examples: [],
    color: colors.red,
  },
  {
    id: 'orfFusible',
    name: 'Fusible ORF, no stop codon',
    type: 'Level 1 Prefix',
    description: ``,
    examples: [],
    color: colors.red,
  },
  {
    id: 'mrna',
    name: 'mRNA',
    type: 'Level 1',
    description: ``,
    examples: [],
    color: colors.red,
  },
  {
    id: 'subslice',
    name: 'Subslice (gene locus)',
    type: 'Level 1 Postfix',
    description: ``,
    examples: [],
    color: colors.red,
  },
  {
    id: 'sliceStart',
    name: 'Start-relative Slice',
    type: 'Level 1 Postfix',
    description: ``,
    examples: [],
    color: colors.red,
  },
  {
    id: 'sliceEnd',
    name: 'End-relative Slice',
    type: 'Level 1 Postfix',
    description: ``,
    examples: [],
    color: colors.red,
  },
  {
    id: 'invert',
    name: 'Invert',
    type: 'Level 2',
    description: ``,
    examples: [],
    color: colors.red,
  },
  {
    id: 'marker',
    name: 'Marker Sequence',
    type: 'Level 2 Operator',
    description: ``,
    examples: [],
    color: colors.red,
  },
  {
    id: 'approximate',
    name: 'Approximate Coordinate',
    type: 'Level 1 Prefix',
    description: ``,
    examples: [],
    color: colors.red,
  },
  {
    id: 'variable',
    name: 'Variable or External Reference',
    type: 'Level 2 Operator',
    description: ``,
    examples: [],
    color: colors.red,
  },
  {
    id: 'customBases',
    name: 'Custom Bases',
    type: 'Level 1 Operator',
    description: ``,
    examples: [],
    color: colors.red,
  },
  {
    id: 'customPeptides',
    name: 'Custom Peptides',
    type: 'Level 1 Operator',
    description: ``,
    examples: [],
    color: colors.red,
  },
  {
    id: 'knockout',
    name: 'Knockout',
    type: 'Level 1 Operator',
    description: ``,
    examples: [],
    color: colors.red,
  },
  {
    id: 'replace',
    name: 'Replace',
    type: 'Level 1 Operator',
    description: ``,
    examples: [],
    color: colors.red,
  },
  {
    id: 'casette',
    name: 'Replace with Casette',
    type: 'Level 1 Operator',
    description: ``,
    examples: [],
    color: colors.red,
  },
]
  .map(operator => {
    return Object.assign(GslOperatorSchema.scaffold(), operator, {
      image: `/images/gsl/GSL-${operator.id}.svg`,
    });
  })
  .reduce((acc, operator) => Object.assign(acc, { [operator.id]: operator }), {});

export const operatorIds = Object.keys(operators);
