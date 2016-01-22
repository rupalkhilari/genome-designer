import { expect } from 'chai';
import { importProject, importBlock } from '../../extensions/convert/import';
import { exportProject, exportBlock } from '../../extensions/convert/export';
const fs = require('fs');

const sampleGenbank = 'LOCUS       1                          6 bp    DNA              UNK 01-JAN-1980\nDEFINITION  .\nACCESSION   1\nVERSION     1\nKEYWORDS    .\nSOURCE      .\n  ORGANISM  .\n            .\nFEATURES             Location/Qualifiers\n     block           1..3\n                     /parent_block="1,0"\n                     /block_id="2"\n     block           1..2\n                     /parent_block="2,0"\n                     /block_id="5"\n     block           1\n                     /parent_block="5,0"\n                     /block_id="8"\n     block           2\n                     /parent_block="5,1"\n                     /block_id="9"\n     block           2\n                     /parent_block="9,0"\n                     /block_id="10"\n     block           3\n                     /parent_block="2,1"\n                     /block_id="6"\n     block           4\n                     /parent_block="1,1"\n                     /block_id="3"\n     block           4\n                     /parent_block="3,0"\n                     /block_id="7"\n     block           5..6\n                     /parent_block="1,2"\n                     /block_id="4"\n     Double_T        5\n                     /parent_block\n                     /block_id="4"\nORIGIN\n        1 acggtt\n//\n';

describe('Genbank Extension', () => {
  it('should import genbank file that has nested blocks', function importGB(done) {
    this.timeout(5000);
    importBlock('genbank', sampleGenbank, output => {
      expect(output.block !== undefined).to.equal(true);
      expect(output.block.components.length === 3).to.equal(true);
      expect(output.blocks['2'].components.length === 2).to.equal(true);
      done();
    });
  });

  it('should be able convert Genbank features to Block', function importGB(done) {
    this.timeout(5000);
    fs.readFile('./test/res/sampleGenbank.gb', 'utf8', (err, sampleStr) => {
      importBlock('genbank', sampleStr, data => {
        expect(data.block !== undefined).to.equal(true);
        expect(data.blocks !== undefined).to.equal(true);
        expect(data.block.components.length === 2).to.equal(true);
        expect(data.blocks[data.block.components[0]] !== undefined).to.equal(true);
        expect(data.blocks[data.block.components[1]] !== undefined).to.equal(true);
        expect(data.blocks[data.block.components[0]].metadata.tags.sbol === 'cds').to.equal(true);
        expect(data.blocks[data.block.components[1]].metadata.tags.sbol === 'cds').to.equal(true);
        done();
      });
    });
  });

  it('should export blocks to genbank', function exportGB(done) {
    this.timeout(5000);
    fs.readFile('./test/res/sampleBlocks.json', 'utf8', (err, sampleBlocksJson) => {
      const sampleBlocks = JSON.parse(sampleBlocksJson);
      exportBlock('genbank', {block: sampleBlocks['1'], blocks: sampleBlocks}, result => {
        expect(result.indexOf('acggtt') !== -1).to.equal(true);
        expect(result.indexOf('block           5..6') !== -1).to.equal(true);
        done();
      });
    });
  });
});
