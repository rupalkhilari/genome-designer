const symbolMap = {
  'promoter': 'Promoter',
  'cds': 'CDS',
  'terminator': 'Terminator',
  'operator': 'Operator',
  'insulator': 'Insulator',
  'originReplication': 'Origin of replication',
  'rbs': 'RBS',
  'protease': 'Protease',
  'ribonuclease': 'Ribonuclease',
  'proteinStability': 'Protein Stability',
  'rnaStability': 'RNA stability',
};

function makeImagePath(fileName, folder = 'thin') {
  return '/images/sbolSymbols/' + folder + '/' + fileName + '.svg';
}

const symbols = Object.keys(symbolMap).map(key => ({
  id: key,
  metadata: {
    name: symbolMap[key],
    image: makeImagePath(key),
  },
}));

export default symbols;
