import { expect } from 'chai';
import { runNode } from '../../extensions/compute/runNode';
const fs = require('fs');

describe('Extensions', () => {
  const dnaFile = process.cwd() + '/temp.txt';
  const input = {DNA: dnaFile};
  it('Biopython translate example should work', function translateDNA(done) {
    this.timeout(6000); //this timeout is not needed if the test is run by itself (using it.only)
    fs.writeFile(dnaFile, 'AACTTGTCCACTGTA', err => {
      if (err) {
        expect(false);
        done();
      }
      runNode('translate_dna_example', input, {})
      .then(result => {
        expect(result.prot === 'NLSTV');
        done();
      })
      .catch(err => {
        expect(false);
        done();
      });
    });
  });
});
