import { expect } from 'chai';
import { convertCsv } from '../../server/extensions/native/csv/convert';
import rejectingFetch from '../../src/middleware/rejectingFetch';

describe('Plugins', () => {
  describe('CSV JS', () => {

    const fileName = 'myFile.csv';
    const fileContents = `Name,Description,Role,Color,Sequence,customField
Blah,This is a cool part,promoter,#99ccccc,ACTTACGCATCAGCTACGACTACTGACTAGCTAGCTAGCTACGATCGCTACGACTG,woogity!`;
    const file = new File([fileContents], fileName);
    const formData = new FormData();
    formData.append('data', file, file.name);

    //todo - verify writing of sequences

    it('should convert a simple file', () => {
      return convertCsv(fileContents)
        .then(({blocks, sequences}) => {
          console.log(blocks);
          console.log(sequences);

          expect(Object.keys(blocks).length === 1);
          expect(Object.keys(sequences).length === 1);

          const block = blocks[Object.keys(blocks)[0]];
          expect(block.metadata.name).to.equal('Blah');
          expect(block.notes.customField).to.eql('woogity!');
        });
    });

    it('should work via REST', () => {
      //todo - test this properly
      return rejectingFetch('/extensions/api/csv', {method: 'POST', body: formData})
        .then(resp => resp.json())
        .then(response => {
          console.log(response);
        });
    });
  });
});
