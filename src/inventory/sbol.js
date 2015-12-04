const symbolMap = {
  'CDS': 'cds',
  'insulator': 'insulator',
  'operator': 'operator',
  'origin of replication': 'originReplication',
  'promoter': 'promoter',
  'protease': 'protease',
  'protein stability': 'proteinStability',
  'RBS': 'rbs',
  'ribonuclease': 'ribonuclease',
  'RNA stability': 'rnaStability',
  'terminator': 'terminator',
};

function makeImagePath(fileName) {
  return '/images/sbolSymbols/' + fileName + '.svg';
}

const symbols = Object.keys(symbolMap).map(key => ({
  id: key,
  metadata: {
    name: key,
    image: makeImagePath(symbolMap[key]),
  },
}));

export default symbols;
