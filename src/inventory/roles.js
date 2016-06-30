/*
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
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
