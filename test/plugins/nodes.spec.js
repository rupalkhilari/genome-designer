import { assert } from 'chai';
import { runNode } from '../../plugins/compute/runNode';
const fs = require('fs');
import path from 'path';

describe('Plugins', () => {
  describe('Nodes Plugin', () => {
    const dnaFile = path.resolve(__dirname, './temp.txt');
    const input = {DNA: dnaFile};
    it('should successfully run the Biopython example', function translateDNA(done) {
      fs.writeFile(dnaFile, 'AACTTGTCCACTGTA', err => {
        if (err) {
          done(err);
          return;
        }
        runNode('translate_dna_example', input, {})
          .then(result => {
            assert(result.Protein === 'NLSTV', 'result incorrect');
            done();
          })
          .catch(done);
      });
    });
  });
});
