import { expect } from 'chai';
import { importProject, importBlock } from '../../extensions/convert/import';
import { exportProject, exportBlock } from '../../extensions/convert/export';

describe('Import/Export', () => {
  const blocks = {
    '1': {
      'id': '1',
      'components': ['2', '3', '4'],
      'sequence': {
        'sequence': '',
        'features': [],
      },
    },
    '2': {
      'id': '2',
      'components': ['5', '6'],
      'sequence': {
        'sequence': '',
        'features': [],
      },
    },
    '3': {
      'id': '3',
      'components': ['7'],
      'sequence': {
        'sequence': '',
        'features': [],
      },
    },
    '4': {
      'id': '4',
      'components': [],
      'sequence': {
        'sequence': 'TT',
        'features': [{
          'start': 0,
          'end': 1,
          'type': 'Double T',
        }],
      },
    },
    '5': {
      'id': '5',
      'components': ['8', '9'],
      'sequence': {
        'sequence': '',
        'features': [],
      },
    },
    '6': {
      'id': '6',
      'components': [],
      'sequence': {
        'sequence': 'G',
        'features': [],
      },
    },
    '7': {
      'id': '7',
      'components': [],
      'sequence': {
        'sequence': 'G',
        'features': [],
      },
    },
    '8': {
      'id': '8',
      'components': [],
      'sequence': {
        'sequence': 'A',
        'features': [],
      },
    },
    '9': {
      'id': '9',
      'components': ['10'],
      'sequence': {
        'sequence': '',
        'features': [],
      },
    },
    '10': {
      'id': '10',
      'components': [],
      'sequence': {
        'sequence': 'C',
        'features': [],
      },
    },
  };

  const sampleBlocks = {
    'block': blocks['1'],
    'blocks': blocks,
  };

  const sampleGenbank = 'LOCUS       1                          6 bp    DNA              UNK 01-JAN-1980\nDEFINITION  .\nACCESSION   1\nVERSION     1\nKEYWORDS    .\nSOURCE      .\n  ORGANISM  .\n            .\nFEATURES             Location/Qualifiers\n     block           1..3\n                     /parent_block="1,0"\n                     /block_id="2"\n     block           1..2\n                     /parent_block="2,0"\n                     /block_id="5"\n     block           1\n                     /parent_block="5,0"\n                     /block_id="8"\n     block           2\n                     /parent_block="5,1"\n                     /block_id="9"\n     block           2\n                     /parent_block="9,0"\n                     /block_id="10"\n     block           3\n                     /parent_block="2,1"\n                     /block_id="6"\n     block           4\n                     /parent_block="1,1"\n                     /block_id="3"\n     block           4\n                     /parent_block="3,0"\n                     /block_id="7"\n     block           5..6\n                     /parent_block="1,2"\n                     /block_id="4"\n     Double_T        5\n                     /parent_block\n                     /block_id="4"\nORIGIN\n        1 acggtt\n//\n';

  it.only('from genbank', function fromGenbank(done) {
    importBlock('genbank', sampleGenbank, result => {
      const output = JSON.parse(result);
      expect(result.block !== undefined);
      expect(output.blocks.length === 10);
      expect(output.block.id === '1');
      expect(output.block.components.length === 3);
      expect(output.block.components[0] === 2);
      expect(output.blocks['5'].components[0] === 8);
      expect(output.blocks['5'].components[1] === 9);
      done();
    });
  });

  it.only('to genbank', function fromGenbank(done) {
    exportBlock('genbank', {block: blocks['1'], blocks: blocks}, result => {
      expect(result === sampleGenbank);
      done();
    });
  });
});
