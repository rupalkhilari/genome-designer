import { assert } from 'chai';
import { searchString } from '../../plugins/search/search';

//todo - refactor. this is a very brittle test
describe('Plugins', () => {
  describe('NCBI Search Plugin', () => {
    it.skip('should be able to search the Nucleotide DB', function nucleotide() {
      this.timeout(60000);

      const query = 'carboxylase';
      return searchString('nucleotide', query, 2)
        .then(output => {
          console.log(output);

          assert(output[0].metadata.name !== undefined, 'got wrong name');
          assert(output[0].metadata.organism !== undefined, 'organism wasnt defined');
          assert(output.length === 2, 'got wrong number of outputs');
        });
    });
  });
});
