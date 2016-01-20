import { expect } from 'chai';
import { searchString } from '../../extensions/search/search';
const query = 'carboxylase';

describe('Search', () => {
  it('NCBI nucleotide DB', function nucleotide(done) {
    this.timeout(10000);  //searching NCBI... so might take long, depending on internet
    searchString('nucleotide', query, 2, result => {
      const output = JSON.parse(result);
      expect(output[0].metadata.source === 'Escherichia coli');
      expect(output.length === 2);
      done();
    });
  });
});
