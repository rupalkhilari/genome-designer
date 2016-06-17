export const symbolMap = {
  promoter: 'Promoter',
  cds: 'CDS',
  terminator: 'Terminator',
  operator: 'Operator',
  insulator: 'Insulator',
  originReplication: 'Origin of Replication',
  rbs: 'RBS',
  protease: 'Protease',
  ribonuclease: 'Ribonuclease',
  proteinStability: 'Protein Stability',
  rnaStability: 'RNA stability',
  restrictionSite: 'Restriction Site',
  structural: 'Structural',
};

export const roleMassager = {
  'gene': 'cds',
  'ribosome entry site': 'rbs',
  'ribonuclease site': 'ribonuclease',
  'rna stability element': 'rnaStability',
  'protease site': 'protease',
  'protein stability element': 'proteinStability',
  'origin of replication': 'originReplication',
  'restriction site': 'restrictionSite',
  'regulatory': 'promoter',
  'mat_peptide': 'cds',
  'rep_origin': 'originReplication',
};

/*
 proposed roles:
 restrictionEnzyme (this is in SBOL)
 structural
   connector
 regulatory
 tag
   reporter
   marker
   selection
 */

function makeImagePath(fileName, folder = 'thin') {
  return '/images/roleSymbols/' + folder + '/' + fileName + '.svg';
}

const symbols = Object.keys(symbolMap).map(key => ({
  id: key,
  name: symbolMap[key],
  images: {
    thin: makeImagePath(key, 'thin'),
    templates: makeImagePath(key, 'templates'),
  },
}));

export default symbols;
