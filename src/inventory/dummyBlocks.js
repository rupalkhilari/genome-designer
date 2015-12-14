import merge from 'lodash.merge';
import uuid from 'node-uuid';
import BlockSchema from '../schemas/Block';

const dummyBlocks = ['Kozak-ATG-NLS', 'Linker 2', 'Linker 3', 'Kozak-ATG', 'NES-STOP', 'KDEL-STOP', 'Linker 1', 'P2A -1', 'p2A-2', 'Kozak-ATG-palmitoylation sequence', 'Kozak-ATG-IgK leader', 'Kozak-ATG-MLS', 'SV40 intron', 'SV40 polyA', 'SV40 ORI', 'Insulator FB', 'Tetracycline-dep ribozyme', 'PGK polyA', 'BGH-polyA', 'DmrC', 'DmrA', 'SV40 promoter', 'TRE3GS promoter', 'CMV promoter', 'CAG promoter', 'IRES2 (with ATG)', 'PuroR-1', 'PuroR-2', 'PuroR-3', 'mNeonGreen-1', 'mRuby2-1', 'mTagBFP-1', 'mNeonGreen-2', 'mRuby2-2', 'mTagBFP-2', 'mNeonGreen-3', 'mRuby2-3', 'mTagBFP-3', 'Kozak-ATG-Tet-ON-3G', 'Rosa 5 Arm', 'Insulator synthetic IS2', 'Rosa 3 Arm', 'chimaeric intron (from SP203)', 'EF1a promoter', 'Tubulin']
  .map((item) => {
    const dummySequenceUrls = [1, 2, 3, 4].map(num => 'dummySeq' + num);
    const dummySeqUrl = dummySequenceUrls[Math.floor(Math.random() * dummySequenceUrls.length)];

    return merge(
      BlockSchema.scaffold(),
      {
        metadata: {
          name: item,
        },
        sequence: {
          url: dummySeqUrl,
        },
      }
    );
  });

//add dummy annotations to the first block
merge(dummyBlocks[0], {
  sequence: {
    annotations: [
      {
        id: uuid.v4(),
        description: 'GFP',
        tags: {},
        optimizability: 'none',
        start: 0,
        end: 50,
      },
      {
        id: uuid.v4(),
        description: 'mCherry',
        tags: {},
        optimizability: 'none',
        start: 40,
        end: 80,
      },
      {
        id: uuid.v4(),
        description: 'BglII',
        tags: {},
        optimizability: 'none',
        sequence: 'agatct',
      },
    ],
  },
});

export default dummyBlocks;
