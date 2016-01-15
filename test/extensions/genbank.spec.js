import { expect } from 'chai';
import { runNode } from '../../extensions/compute/runNode';
const fs = require('fs');

describe('Genbank', () => {
  it.only('should convert from block', (done) => {
    const sampleBlock = {
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

    const path = process.cwd() + '/tempBlock.json';
    const fileUrls = {block: path};
    console.log(path);

    fs.writeFile(path, JSON.stringify(sampleBlock))
      .then(err => {
        runNode('block_to_genbank', fileUrls, {})
          .then(result => {
            expect(true);
            done();
          })
          .catch(err => {
            expect(false);
            done();
          });
      })
      .catch(err => {
        expect(false);
        done();
      });
  });
});
